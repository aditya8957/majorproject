import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, FileText, Clock3, CheckCircle2, XCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchNGOApplications } from '../ngoSlice';

const labels = { pending: 'Pending Response', accepted: 'Accepted', aid_preparation: 'Aid Being Prepared', aid_ready: 'Aid Ready', ready_for_pickup: 'Ready for Pickup', ready_for_distribution: 'Ready for Camp', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', beneficiary_confirmed: 'Receipt Confirmed', rejected: 'Rejected', fulfillment: 'Fulfillment', proof_submitted: 'Proof Submitted', proof_rejected: 'Proof Rejected', completed: 'Completed' };
const colors = { pending: 'bg-amber-50 text-amber-700', accepted: 'bg-emerald-50 text-emerald-700', rejected: 'bg-red-50 text-red-700', fulfillment: 'bg-blue-50 text-blue-700', proof_submitted: 'bg-orange-50 text-orange-700', completed: 'bg-green-50 text-green-700' };

export default function NGODashboard() {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector(state => state.ngo);
  const user = useSelector(state => state.auth.user);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  useEffect(() => { dispatch(fetchNGOApplications()); }, [dispatch]);
  const visible = useMemo(() => applications.filter(item => (filter === 'all' || item.ngoStatus === filter) && `${item.applicationId} ${item.fullName} ${item.requiredDevice}`.toLowerCase().includes(search.toLowerCase())), [applications, filter, search]);
  const count = status => applications.filter(item => item.ngoStatus === status).length;
  return <div className="min-h-screen bg-slate-50 p-4 sm:p-8"><div className="mx-auto max-w-7xl space-y-8">
    <header><h1 className="text-3xl font-bold text-slate-900">NGO Dashboard</h1><p className="mt-1 text-slate-500">Welcome, {user?.firstName || 'partner'}</p></header>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{[['pending','Pending Requests',Clock3],['accepted','Accepted',CheckCircle2],['fulfillment','Fulfillment',Truck],['proof_submitted','Proof Pending',FileText],['completed','Completed',CheckCircle2]].map(([key,title,Icon]) => <button key={key} onClick={() => setFilter(key)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"><Icon className="text-emerald-600" size={20}/><p className="mt-4 text-2xl font-bold text-slate-900">{count(key)}</p><p className="text-sm text-slate-500">{title}</p></button>)}</div>
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between"><h2 className="text-xl font-bold text-slate-900">Assigned Applications</h2><div className="flex gap-3"><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search applications" className="rounded-xl border border-slate-200 py-2 pl-10 pr-3 outline-none focus:border-emerald-500"/></div><select value={filter} onChange={event => setFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2"><option value="all">All</option>{Object.entries(labels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></div></div>
      {loading ? <p className="p-10 text-center text-slate-500">Loading applications...</p> : error ? <p className="p-10 text-center text-red-600">{error}</p> : visible.length === 0 ? <p className="p-10 text-center text-slate-500">No assigned applications found.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Application</th><th className="px-5 py-4">Beneficiary</th><th className="px-5 py-4">Device</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead><tbody>{visible.map((item,index) => <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * .03 }} key={item.applicationId} className="border-t border-slate-100"><td className="px-5 py-4 font-mono font-semibold">{item.applicationId}</td><td className="px-5 py-4 font-medium text-slate-800">{item.fullName}</td><td className="px-5 py-4 text-slate-600">{item.requiredDevice}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[item.ngoStatus] || 'bg-slate-100 text-slate-600'}`}>{labels[item.ngoStatus] || item.ngoStatus}</span></td><td className="px-5 py-4"><Link className="font-semibold text-emerald-700 hover:text-emerald-900" to={`/ngo/applications/${item.applicationId}`}>View</Link></td></motion.tr>)}</tbody></table></div>}
    </section>
  </div></div>;
}