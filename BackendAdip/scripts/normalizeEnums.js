require('dotenv').config();
const mongoose = require('mongoose');
const Beneficiary = require('../src/models/beneficiary');
const TrackStatus = require('../src/models/trackStatus');
const NGO = require('../src/models/ngoSchema');
const { LEGACY_STATUS_MAP } = require('../src/constants/enums');

const run = async () => {
  await mongoose.connect(process.env.DB_CONNECT_STRING, { tls: true, serverSelectionTimeoutMS: 10000 });
  const statusUpdates = Object.entries(LEGACY_STATUS_MAP).map(([from, to]) => ({ updateMany: { filter: { applicationStatus: from }, update: { $set: { applicationStatus: to } } } }));
  for (const operation of statusUpdates) await Beneficiary.bulkWrite([operation]);
  for (const [from, to] of Object.entries(LEGACY_STATUS_MAP)) {
    await TrackStatus.updateMany({ status: from }, { $set: { status: to } });
    await TrackStatus.updateMany({ 'history.status': from }, { $set: { 'history.$[entry].status': to } }, { arrayFilters: [{ 'entry.status': from }] });
  }
  await NGO.updateMany({ status: 'Pending' }, { $set: { status: 'pending' } });
  await NGO.updateMany({ status: 'Approved' }, { $set: { status: 'approved' } });
  await NGO.updateMany({ status: 'Rejected' }, { $set: { status: 'rejected' } });
  await Beneficiary.updateMany({ requiredDevice: 'hearing' }, { $set: { requiredDevice: 'hearing_aid' } });
  await Beneficiary.updateMany({ requiredDevice: 'braille' }, { $set: { requiredDevice: 'braille_kit' } });
  console.log('Enum normalization completed. Ambiguous device values were not changed automatically.');
  await mongoose.disconnect();
};

run().catch(error => { console.error(error); process.exitCode = 1; });
