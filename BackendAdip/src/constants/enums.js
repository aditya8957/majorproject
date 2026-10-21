const APPLICATION_STATUS = Object.freeze({
  SUBMITTED: 'submitted', UNDER_REVIEW: 'under_review', APPROVED: 'approved', NGO_ASSIGNED: 'ngo_assigned',
  PROCESSING_AT_NGO: 'processing_at_ngo', AID_PREPARATION: 'aid_preparation', AID_READY: 'aid_ready',
  READY_FOR_PICKUP: 'ready_for_pickup', READY_FOR_DISTRIBUTION: 'ready_for_distribution', OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered', BENEFICIARY_CONFIRMED: 'beneficiary_confirmed', PROOF_SUBMITTED: 'proof_submitted',
  PROOF_REJECTED: 'proof_rejected', COMPLETED: 'completed', REJECTED: 'rejected'
});

const DISABILITY_TYPES = Object.freeze(['locomotor', 'visual', 'hearing', 'speech', 'intellectual', 'learning', 'autism', 'mental_illness', 'neurological', 'blood_disorder', 'chronic_illness', 'multiple', 'other']);
const DEVICE_TYPES = Object.freeze(['wheelchair', 'crutches', 'prosthetic', 'walking_stick', 'hearing_aid', 'cochlear_implant', 'braille_kit', 'screen_reader', 'speech_device', 'communication_board', 'therapy_tools', 'assistive_software', 'other']);
const DEVICE_LABELS = Object.freeze({ wheelchair: 'Wheelchair', crutches: 'Crutches', prosthetic: 'Prosthetic Limb', walking_stick: 'Walking Stick / Cane', hearing_aid: 'Hearing Aid', cochlear_implant: 'Cochlear Implant', braille_kit: 'Braille Kit', screen_reader: 'Screen Reader', speech_device: 'Speech Device', communication_board: 'Communication Board', therapy_tools: 'Therapy Tools', assistive_software: 'Assistive Software', other: 'Other' });
const GENDER_TYPES = Object.freeze(['male', 'female', 'other']);
const NGO_STATUS = Object.freeze(['not_assigned', 'pending', 'accepted', 'rejected', 'fulfillment', ...Object.values(APPLICATION_STATUS).filter(status => !['submitted', 'under_review', 'approved', 'ngo_assigned', 'processing_at_ngo', 'rejected'].includes(status))]);
const DISTRIBUTION_STATUS = Object.freeze(['pending', 'accepted', 'aid_preparation', 'aid_ready', 'ready_for_pickup', 'ready_for_distribution', 'out_for_delivery', 'delivered', 'beneficiary_confirmed', 'proof_submitted', 'proof_rejected', 'completed']);
const DISTRIBUTION_METHODS = Object.freeze(['doorstep', 'center_pickup', 'distribution_camp']);
const VERIFICATION_STATUS = Object.freeze(['pending', 'verified', 'rejected']);

const LEGACY_STATUS_MAP = Object.freeze({ pending: APPLICATION_STATUS.SUBMITTED, PENDING: APPLICATION_STATUS.SUBMITTED, PENDING_VERIFICATION: APPLICATION_STATUS.SUBMITTED, UNDER_REVIEW: APPLICATION_STATUS.UNDER_REVIEW, APPROVED: APPLICATION_STATUS.APPROVED, NGO_ASSIGNED: APPLICATION_STATUS.NGO_ASSIGNED, PROCESSING: APPLICATION_STATUS.PROCESSING_AT_NGO, PROCESSING_AT_NGO: APPLICATION_STATUS.PROCESSING_AT_NGO, DELIVERED: APPLICATION_STATUS.DELIVERED, PROOF_SUBMITTED: APPLICATION_STATUS.PROOF_SUBMITTED, COMPLETED: APPLICATION_STATUS.COMPLETED, REJECTED: APPLICATION_STATUS.REJECTED });
const normalizeApplicationStatus = (value) => LEGACY_STATUS_MAP[value] || value;
const STATUS_TRANSITIONS = Object.freeze({
  submitted: ['under_review', 'rejected'], under_review: ['approved', 'rejected'], approved: ['ngo_assigned'], ngo_assigned: ['processing_at_ngo'],
  processing_at_ngo: ['aid_preparation', 'rejected'], aid_preparation: ['aid_ready'], aid_ready: ['ready_for_pickup', 'ready_for_distribution', 'out_for_delivery'],
  ready_for_pickup: ['delivered'], ready_for_distribution: ['delivered'], out_for_delivery: ['delivered'], delivered: ['beneficiary_confirmed', 'proof_submitted'],
  beneficiary_confirmed: ['proof_submitted'], proof_submitted: ['completed', 'proof_rejected'], proof_rejected: ['proof_submitted']
});

module.exports = { APPLICATION_STATUS, DISABILITY_TYPES, DEVICE_TYPES, DEVICE_LABELS, GENDER_TYPES, NGO_STATUS, DISTRIBUTION_STATUS, DISTRIBUTION_METHODS, VERIFICATION_STATUS, LEGACY_STATUS_MAP, normalizeApplicationStatus, STATUS_TRANSITIONS };