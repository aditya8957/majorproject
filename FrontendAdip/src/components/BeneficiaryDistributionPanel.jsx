import React, { useState } from 'react';
import api from '../utils/api';

const labels = { pending: 'Pending', accepted: 'Accepted', aid_preparation: 'Aid Being Prepared', aid_ready: 'Aid Ready', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', beneficiary_confirmed: 'Receipt Confirmed', proof_submitted: 'Proof Submitted', proof_rejected: 'Proof Rejected', completed: 'Completed' };

export default function BeneficiaryDistributionPanel({ application, onUpdated }) {
  const [problem, setProblem] = useState('');
  const [error, setError] = useState('');
  const status = application.distribution?.status || application.ngoStatus || application.applicationStatus;
  const request = async (path, body) => {
    try { setError(''); await api.put(`/user/profile/applications/${application.applicationId}/${path}`, body); await onUpdated(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update application'); }
  };
  return <section className="border-t border-gray-200 pt-5"><h4 className="text-md font-semibold text-gray-900 mb-3">Distribution Timeline</h4><div className="space-y-2">{Object.entries(labels).map(([key, label]) => <div key={key} className={`rounded-lg px-3 py-2 text-sm ${key === status ? 'bg-blue-100 font-semibold text-blue-800' : 'bg-gray-50 text-gray-500'}`}>{label}</div>)}</div>{status === 'delivered' && <div className="mt-4 space-y-3 rounded-lg bg-emerald-50 p-4"><p className="text-sm text-emerald-800">The NGO marked this aid as delivered. Did you receive it?</p><button onClick={() => request('confirm-receipt')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Confirm Receipt</button><textarea value={problem} onChange={event => setProblem(event.target.value)} placeholder="Report a delivery problem" className="w-full rounded-lg border p-2 text-sm"/><button disabled={!problem.trim()} onClick={() => request('report-problem', { reason: problem })} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40">Report a Problem</button></div>}{application.deliveryProblem?.reported && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Problem reported: {application.deliveryProblem.reason}</p>}{error && <p className="mt-3 text-sm text-red-600">{error}</p>}</section>;
}