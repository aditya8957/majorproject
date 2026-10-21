import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { fetchNGOApplication, mutateNGOApplication } from '../ngoSlice';

const statusLabel = {
  pending: 'Pending Response', accepted: 'Request Accepted', aid_preparation: 'Aid Being Prepared',
  aid_ready: 'Aid Ready', ready_for_pickup: 'Ready for Center Pickup', ready_for_distribution: 'Ready for Camp Distribution',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', beneficiary_confirmed: 'Receipt Confirmed',
  proof_submitted: 'Proof Submitted', proof_rejected: 'Proof Rejected', completed: 'Completed'
};

export default function NGOWorkflowPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, loading, error } = useSelector(state => state.ngo);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [method, setMethod] = useState('doorstep');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => { dispatch(fetchNGOApplication(id)); }, [dispatch, id]);
  if (loading && !selected) return <div className="p-10 text-center">Loading application...</div>;
  if (error && !selected) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!selected) return null;
  const status = selected.distribution?.status || selected.ngoStatus;
  const run = (action, payload) => dispatch(mutateNGOApplication({ id, action, payload }));
  const submitProof = event => {
    event.preventDefault();
    const payload = new FormData();
    payload.append('distributionDate', selected.distribution?.deliveredAt || new Date().toISOString());
    payload.append('distributionRemarks', note);
    payload.append('proof', file);
    run('distribute', payload);
  };
  return <div className="min-h-screen bg-slate-50 p-4 sm:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <Link to="/ngo/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><ArrowLeft size={16}/> Back to dashboard</Link>
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="font-mono text-sm text-slate-500">{selected.applicationId}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{selected.fullName}</h1><p className="mt-2 text-slate-600">{selected.requiredDevice} · {statusLabel[status] || status}</p></header>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Beneficiary & Distribution</h2><dl className="mt-5 space-y-3 text-sm"><div><dt className="text-slate-500">Address</dt><dd className="font-semibold">{selected.address}, {selected.state} - {selected.pinCode}</dd></div><div><dt className="text-slate-500">Phone</dt><dd className="font-semibold">{selected.phone}</dd></div><div><dt className="text-slate-500">Current status</dt><dd className="font-semibold text-emerald-700">{statusLabel[status] || status}</dd></div></dl>
        <div className="mt-6 space-y-2">{Object.entries(statusLabel).map(([key, label]) => <div key={key} className={`rounded-lg px-3 py-2 text-sm ${key === status ? 'bg-emerald-100 font-bold text-emerald-800' : 'bg-slate-50 text-slate-500'}`}>{label}</div>)}</div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Next Action</h2>
        {status === 'pending' && <div className="mt-5 space-y-3"><button onClick={() => run('accept')} className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Accept Request</button><textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Message beneficiary" className="w-full rounded-xl border p-3"/><button disabled={!message.trim()} onClick={() => run('message', { message })} className="w-full rounded-xl border px-4 py-3 font-semibold disabled:opacity-40">Contact Beneficiary</button></div>}
        {status === 'accepted' && <div className="mt-5 space-y-3"><button onClick={() => run('availability', { available: true })} className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Confirm Aid Available</button><button onClick={() => run('availability', { available: false, note: 'Aid is being arranged.' })} className="w-full rounded-xl border px-4 py-3 font-semibold">Aid Being Arranged</button></div>}
        {status === 'aid_preparation' && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-amber-800">Aid is being arranged. Mark it available when preparation is complete.</p>}
        {status === 'aid_ready' && <div className="mt-5 space-y-3"><select value={method} onChange={event => setMethod(event.target.value)} className="w-full rounded-xl border p-3"><option value="doorstep">Doorstep Delivery</option><option value="center_pickup">Center Pickup</option><option value="distribution_camp">Distribution Camp</option></select><input type="date" value={date} onChange={event => setDate(event.target.value)} className="w-full rounded-xl border p-3"/><button disabled={!date} onClick={() => run('distribution-method', { method, expectedDeliveryDate: date, pickupDate: date, instructions: note })} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-40">Set Distribution Method</button></div>}
        {['out_for_delivery', 'ready_for_pickup', 'ready_for_distribution'].includes(status) && <button onClick={() => run('deliver')} className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Mark Aid Delivered / Collected</button>}
        {status === 'delivered' && <p className="mt-5 rounded-xl bg-blue-50 p-4 text-blue-800">Waiting for beneficiary receipt confirmation before proof submission.</p>}
        {status === 'beneficiary_confirmed' || status === 'proof_rejected' ? <form onSubmit={submitProof} className="mt-5 space-y-3"><textarea required value={note} onChange={event => setNote(event.target.value)} placeholder="Distribution remarks" className="w-full rounded-xl border p-3"/><input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setFile(event.target.files[0])} className="w-full text-sm"/><button className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Submit Distribution Proof</button></form> : null}
        {status === 'proof_submitted' && <p className="mt-5 rounded-xl bg-orange-50 p-4 text-orange-800">Proof submitted. Waiting for Admin verification.</p>}
        {status === 'completed' && <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800">Distribution verified and completed.</p>}
      </section>
    </div>
  </div></div>;
}