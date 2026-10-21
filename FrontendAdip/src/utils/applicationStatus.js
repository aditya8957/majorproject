export const APPLICATION_STATUS = {
  SUBMITTED: 'submitted', UNDER_REVIEW: 'under_review', APPROVED: 'approved', NGO_ASSIGNED: 'ngo_assigned',
  PROCESSING_AT_NGO: 'processing_at_ngo', AID_PREPARATION: 'aid_preparation', AID_READY: 'aid_ready',
  OUT_FOR_DELIVERY: 'out_for_delivery', DELIVERED: 'delivered', BENEFICIARY_CONFIRMED: 'beneficiary_confirmed', PROOF_SUBMITTED: 'proof_submitted',
  READY_FOR_PICKUP: 'ready_for_pickup', READY_FOR_DISTRIBUTION: 'ready_for_distribution',
  PROOF_REJECTED: 'proof_rejected', COMPLETED: 'completed', REJECTED: 'rejected'
};

export const APPLICATION_STATUSES = Object.values(APPLICATION_STATUS);

export const normalizeApplicationStatus = (status) => {
  const value = String(status || '').toLowerCase().replace(/-/g, '_');
  const aliases = {
    pending: APPLICATION_STATUS.SUBMITTED, pending_verification: APPLICATION_STATUS.SUBMITTED,
    approved: APPLICATION_STATUS.APPROVED, ngo_assigned: APPLICATION_STATUS.NGO_ASSIGNED,
    processing: APPLICATION_STATUS.PROCESSING_AT_NGO, processing_at_ngo: APPLICATION_STATUS.PROCESSING_AT_NGO,
    delivered: APPLICATION_STATUS.DELIVERED, proof_submitted: APPLICATION_STATUS.PROOF_SUBMITTED,
    proof_rejected: APPLICATION_STATUS.PROOF_REJECTED
  };
  return aliases[value] || value || APPLICATION_STATUS.SUBMITTED;
};

export const getStatusLabel = (status) => normalizeApplicationStatus(status).replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());