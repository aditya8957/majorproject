const Beneficiary = require('../models/beneficiary');
const NGO = require('../models/ngoSchema');
const updateTrackStatus = require('../utils/updateTrackStatus');
const cloudinary = require('../config/cloudinary');
const { APPLICATION_STATUS } = require('../constants/enums');

const notify = (application, recipientRole, message, type = 'application_update') => {
  application.notifications.push({ recipientRole, message, type, createdAt: new Date() });
};
const syncDistribution = (application, status) => {
  if (!application.distribution) application.distribution = { status: 'pending' };
  application.distribution.status = status;
  application.ngoStatus = status;
  application.applicationStatus = status === 'accepted' ? APPLICATION_STATUS.PROCESSING_AT_NGO : status;
};

const getApprovedNGO = async (userId) => NGO.findOne({ userId, status: 'Approved' });

const getOwnedApplication = async (req, applicationId) => {
  const ngo = await getApprovedNGO(req.user._id);
  if (!ngo) return { error: { status: 403, message: 'NGO approval required' } };
  const application = await Beneficiary.findOne({ applicationId, assignedNGO: ngo._id });
  if (!application) return { error: { status: 404, message: 'Application not found for this NGO' } };
  return { ngo, application };
};

const serialize = (application) => ({
  _id: application._id,
  applicationId: application.applicationId,
  fullName: application.fullName,
  phone: application.phone,
  email: application.email,
  dateOfBirth: application.dateOfBirth,
  gender: application.gender,
  disabilityType: application.disabilityType,
  disabilityPercentage: application.disabilityPercentage,
  address: application.address,
  state: application.state,
  pinCode: application.pinCode,
  requiredDevice: application.requiredDevice,
  applicationStatus: application.applicationStatus,
  ngoStatus: application.ngoStatus,
  assignedNGO: application.assignedNGO,
  sentToNGO: application.sentToNGO,
  expectedDistributionDate: application.expectedDistributionDate,
  distributionDate: application.distributionDate,
  distributionRemarks: application.distributionRemarks,
  distribution: application.distribution,
  communications: application.communications,
  deliveryProblem: application.deliveryProblem,
  notifications: application.notifications,
  distributionProof: application.distributionProof,
  adminVerification: application.adminVerification,
  disabilityCertificate: application.disabilityCertificate,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt
});

const getApplications = async (req, res) => {
  try {
    const ngo = await getApprovedNGO(req.user._id);
    if (!ngo) return res.status(403).json({ message: 'NGO approval required' });
    const applications = await Beneficiary.find({ assignedNGO: ngo._id, sentToNGO: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: applications.map(application => ({ ...serialize(application), notifications: application.notifications.filter(item => item.recipientRole === 'ngo') })) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getApplication = async (req, res) => {
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    res.json({ success: true, data: { ...serialize(result.application), notifications: result.application.notifications.filter(item => item.recipientRole === 'ngo') } });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const transition = (expected, next, message, trackStatus) => async (req, res) => {
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application } = result;
    if (!application.sentToNGO || application.ngoStatus !== expected) return res.status(409).json({ message: `Application must be ${expected}` });
    application.ngoStatus = next;
    if (next === 'accepted') {
      syncDistribution(application, 'accepted');
      notify(application, 'beneficiary', `Your application has been accepted by the assigned NGO.`, 'ngo_accepted');
    }
    application.ngoResponseAt = new Date();
    if (next !== 'rejected') application.ngoRejectionReason = null;
    await application.save();
    await updateTrackStatus(application.applicationId, { status: trackStatus.toLowerCase(), message });
    res.json({ success: true, data: serialize(application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const reject = async (req, res) => {
  const reason = String(req.body.reason || '').trim();
  if (!reason) return res.status(422).json({ message: 'Rejection reason is required' });
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application } = result;
    if (!application.sentToNGO || application.ngoStatus !== 'pending') return res.status(409).json({ message: 'Only pending applications can be rejected' });
    application.ngoStatus = 'rejected';
    application.applicationStatus = 'rejected';
    application.ngoRejectionReason = reason;
    application.ngoResponseAt = new Date();
    await application.save();
    await updateTrackStatus(application.applicationId, { status: 'REJECTED', message: 'NGO rejected application' });
    res.json({ success: true, data: serialize(application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const fulfillment = async (req, res) => {
  const expectedDistributionDate = new Date(req.body.expectedDistributionDate);
  if (Number.isNaN(expectedDistributionDate.getTime())) return res.status(422).json({ message: 'A valid distribution date is required' });
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application } = result;
    if (application.ngoStatus !== 'accepted') return res.status(409).json({ message: 'Application must be accepted before fulfillment' });
    application.ngoStatus = 'fulfillment';
    syncDistribution(application, 'aid_preparation');
    application.expectedDistributionDate = expectedDistributionDate;
    application.distribution.expectedDeliveryDate = expectedDistributionDate;
    notify(application, 'beneficiary', 'Your requested aid is being prepared.', 'aid_preparation');
    await application.save();
    await updateTrackStatus(application.applicationId, { status: 'aid_preparation', message: 'Device fulfillment started' });
    res.json({ success: true, data: serialize(application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const availability = async (req, res) => {
  const available = req.body.available;
  if (typeof available !== 'boolean') return res.status(422).json({ message: 'available must be true or false' });
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application, ngo } = result;
    if (application.ngoStatus !== 'accepted') return res.status(409).json({ message: 'Application must be accepted first' });
    syncDistribution(application, available ? 'aid_ready' : 'aid_preparation');
    application.distribution.ngoRemarks = String(req.body.note || '').trim() || null;
    notify(application, 'beneficiary', available ? `Your requested aid is ready for distribution.` : `Your requested aid is being arranged.`, available ? 'aid_ready' : 'aid_preparation');
    await application.save();
    await updateTrackStatus(application.applicationId, { status: available ? 'aid_ready' : 'aid_preparation', message: available ? 'Aid is ready for distribution' : 'Aid is being arranged' });
    res.json({ success: true, data: serialize(application), ngoName: ngo.ngoName });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const setDistributionMethod = async (req, res) => {
  const { method, expectedDeliveryDate, pickupDate, campName, campLocation, instructions } = req.body;
  const validMethods = ['doorstep', 'center_pickup', 'distribution_camp'];
  if (!validMethods.includes(method)) return res.status(422).json({ message: 'Valid distribution method is required' });
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application } = result;
    if (!application.distribution) application.distribution = { status: 'pending' };
    if (application.distribution.status !== 'aid_ready') return res.status(409).json({ message: 'Aid must be ready before selecting distribution method' });
    application.distribution.method = method;
    application.distribution.expectedDeliveryDate = expectedDeliveryDate ? new Date(expectedDeliveryDate) : null;
    application.distribution.pickupDate = pickupDate ? new Date(pickupDate) : null;
    application.distribution.campName = campName || null;
    application.distribution.campLocation = campLocation || null;
    application.distribution.instructions = instructions || null;
    const nextStatus = method === 'doorstep' ? 'out_for_delivery' : method === 'center_pickup' ? 'ready_for_pickup' : 'ready_for_distribution';
    syncDistribution(application, nextStatus);
    notify(application, 'beneficiary', method === 'doorstep' ? 'Your aid is out for delivery.' : 'Your aid is ready for distribution.', 'distribution_ready');
    await application.save();
    await updateTrackStatus(application.applicationId, { status: nextStatus, message: `Distribution method selected: ${method}` });
    res.json({ success: true, data: serialize(application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markDelivered = async (req, res) => {
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application } = result;
    if (!application.distribution) application.distribution = { status: 'pending' };
    if (!['out_for_delivery', 'ready_for_pickup', 'ready_for_distribution'].includes(application.distribution.status)) return res.status(409).json({ message: 'Aid is not ready to be marked delivered' });
    syncDistribution(application, 'delivered');
    application.distribution.deliveredAt = new Date();
    application.distributionDate = application.distribution.deliveredAt;
    notify(application, 'beneficiary', 'Your aid has been marked as delivered. Please confirm whether you received it.', 'delivered');
    await application.save();
    await updateTrackStatus(application.applicationId, { status: 'delivered', message: 'Aid marked as delivered' });
    res.json({ success: true, data: serialize(application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const sendMessage = async (req, res) => {
  const message = String(req.body.message || '').trim();
  if (!message) return res.status(422).json({ message: 'Message is required' });
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    result.application.communications.push({ senderRole: 'ngo', message });
    notify(result.application, 'beneficiary', message, 'communication');
    await result.application.save();
    res.json({ success: true, data: serialize(result.application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const distribute = async (req, res) => {
  const distributionDate = new Date(req.body.distributionDate);
  const remarks = String(req.body.distributionRemarks || '').trim();
  if (Number.isNaN(distributionDate.getTime()) || !remarks || !req.file) return res.status(422).json({ message: 'Distribution date, remarks, and proof are required' });
  try {
    const result = await getOwnedApplication(req, req.params.applicationId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    const { application } = result;
    if (!application.distribution) application.distribution = { status: 'pending' };
    if (!['delivered', 'beneficiary_confirmed', 'proof_rejected'].includes(application.distribution.status) || !application.distribution.beneficiaryConfirmed) return res.status(409).json({ message: 'Beneficiary receipt confirmation is required before submitting proof' });
    const upload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'distribution_proofs', resource_type: 'auto' }, (error, value) => error ? reject(error) : resolve(value));
      stream.end(req.file.buffer);
    });
    application.ngoStatus = 'proof_submitted';
    syncDistribution(application, 'proof_submitted');
    application.distributionDate = distributionDate;
    application.distributionRemarks = remarks;
    application.distributionProof = { fileName: req.file.originalname, fileUrl: upload.secure_url, publicId: upload.public_id, uploadedAt: new Date() };
    application.distribution.proofUrl = upload.secure_url;
    application.distribution.proofSubmittedAt = new Date();
    application.distribution.adminRejectionReason = null;
    application.adminVerification = { status: 'pending', comment: null, verifiedBy: null, verifiedAt: null };
    notify(application, 'admin', `Distribution proof submitted for ${application.applicationId}. Verification required.`, 'proof_submitted');
    await application.save();
    await updateTrackStatus(application.applicationId, { status: 'proof_submitted', message: 'Distribution proof submitted' });
    res.json({ success: true, data: serialize(application) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProfile = async (req, res) => {
  try {
    const ngo = await getApprovedNGO(req.user._id);
    if (!ngo) return res.status(403).json({ message: 'NGO approval required' });
    res.json({ success: true, data: ngo });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getApplications, getApplication, accept: transition('pending', 'accepted', 'NGO accepted application', 'processing_at_ngo'), reject, fulfillment, availability, setDistributionMethod, markDelivered, sendMessage, distribute, getProfile };