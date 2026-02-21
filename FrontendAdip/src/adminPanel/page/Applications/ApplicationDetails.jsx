import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyDocument, updateApplicationStatus } from '../../store';
import {
  ArrowLeft,
  Printer,
  MoreVertical,
  User,
  Package,
  FileText,
  Info,
  Download,
  Check,
  XCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from '../../component/StatusBadge';
import { motion, AnimatePresence } from "framer-motion";

export const ApplicationDetailsPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const app = useSelector((state) =>
    state.app.applications.find((a) => a.id === id)
  );

  const ngos = useSelector((state) => state.app.ngos);

  const [verificationStep, setVerificationStep] = useState(1);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedNGOId, setSelectedNGOId] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  if (!app) return <div>Application not found</div>;

  const isEligible =
    app.disabilityPercentage >= 40 &&
    app.monthlyIncome < 20000;

  const handleVerifyDoc = (docId, status) => {
    dispatch(
      verifyDocument({
        appId: app.id,
        docId,
        status
      })
    );
  };

  const handleApprove = () => {
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: 'APPROVED'
      })
    );
    setVerificationStep(4);
  };

  const handleReject = () => {
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: 'REJECTED',
        rejectionReason
      })
    );
    setShowRejectionModal(false);
    navigate('/applications');
  };

  const handleAssignNGO = () => {
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: 'NGO_ASSIGNED',
        ngoId: selectedNGOId
      })
    );
    setVerificationStep(5);
  };

  const handleForwardToNGO = () => {
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: 'PROCESSING_AT_NGO'
      })
    );
    navigate('/applications');
  };

   return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/applications')}
            className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Application Details</h2>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-slate-500 font-mono text-sm">{app.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600"><Printer size={20} /></button>
          <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Applicant Info */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-emerald-500" />
              Applicant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <p className="text-slate-900 font-semibold">{app.applicantName}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</label>
                  <p className="text-slate-900 font-semibold">{app.contact}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                  <p className="text-slate-900 font-semibold">{app.address}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disability Type</label>
                  <p className="text-slate-900 font-semibold">{app.disabilityType} ({app.disabilityPercentage}%)</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Income</label>
                  <p className="text-slate-900 font-semibold">₹{app.monthlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Date</label>
                  <p className="text-slate-900 font-semibold">{format(new Date(app.date), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Device Request */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Package size={20} className="text-emerald-500" />
              Device Request
            </h3>
            <div className="flex items-start justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{app.deviceRequested}</h4>
                <p className="text-slate-500">{app.deviceType}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                  <Info size={14} />
                  Doctor's recommendation attached
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</p>
                <p className="text-2xl font-bold text-emerald-600">₹{app.estimatedCost.toLocaleString()}</p>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-emerald-500" />
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {app.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{doc.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'verified' ? (
                      <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold px-3 py-1 bg-emerald-50 rounded-full">
                        <Check size={14} /> Verified
                      </span>
                    ) : doc.status === 'rejected' ? (
                      <span className="text-red-500 flex items-center gap-1 text-xs font-bold px-3 py-1 bg-red-50 rounded-full">
                        <XCircle size={14} /> Rejected
                      </span>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleVerifyDoc(doc.id, 'verified')}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Check size={20} />
                        </button>
                        <button 
                          onClick={() => handleVerifyDoc(doc.id, 'rejected')}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Workflow Action Panel */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
            <div className="p-6 bg-slate-900 text-white">
              <h3 className="text-lg font-bold">Processing Workflow</h3>
              <div className="mt-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1.5 flex-1 rounded-full ${s <= verificationStep ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Step 1: Document Checklist */}
              {verificationStep === 1 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">1. Document Verification</h4>
                  <div className="space-y-4">
                    {app.documents.map(doc => (
                      <label key={doc.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${doc.status === 'verified' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 group-hover:border-emerald-500'}`}>
                          {doc.status === 'verified' && <Check size={14} />}
                        </div>
                        <span className={`text-sm font-medium ${doc.status === 'verified' ? 'text-slate-900' : 'text-slate-500'}`}>
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} Proof
                        </span>
                      </label>
                    ))}
                  </div>
                  <button 
                    disabled={app.documents.some(d => d.status !== 'verified')}
                    onClick={() => setVerificationStep(2)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Continue to Eligibility
                  </button>
                </div>
              )}

              {/* Step 2: Eligibility Calculator */}
              {verificationStep === 2 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">2. Eligibility Verification</h4>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Disability % (≥40)</span>
                      <span className={`font-bold ${app.disabilityPercentage >= 40 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {app.disabilityPercentage}% {app.disabilityPercentage >= 40 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Income (&lt;20k)</span>
                      <span className={`font-bold ${app.monthlyIncome < 20000 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ₹{app.monthlyIncome} {app.monthlyIncome < 20000 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Result</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {isEligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                  </div>

                  {isEligible ? (
                    <button 
                      onClick={() => setVerificationStep(3)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Proceed to Approval
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowRejectionModal(true)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Reject Application
                    </button>
                  )}
                </div>
              )}

              {/* Step 3: Final Approval */}
              {verificationStep === 3 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">3. Final Approval</h4>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
                    <AlertCircle className="text-emerald-500 shrink-0" size={24} />
                    <p className="text-sm text-emerald-800">
                      Applicant has met all criteria. Approving this will notify the user and move to NGO assignment.
                    </p>
                  </div>
                  <button 
                    onClick={handleApprove}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Approve Application
                  </button>
                </div>
              )}

              {/* Step 4: NGO Assignment */}
              {verificationStep === 4 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">4. NGO Assignment</h4>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase">Select Implementing Agency</label>
                    <select 
                      value={selectedNGOId}
                      onChange={(e) => setSelectedNGOId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select an NGO...</option>
                      {ngos.filter(n => n.deviceTypes.includes(app.deviceType) || n.deviceTypes.some(dt => app.deviceRequested.includes(dt))).map(ngo => (
                        <option key={ngo.id} value={ngo.id}>{ngo.name} ({ngo.location})</option>
                      ))}
                    </select>

                    {selectedNGOId && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <p className="text-sm font-bold text-slate-900">{ngos.find(n => n.id === selectedNGOId)?.name}</p>
                        <p className="text-xs text-slate-500">Workload: {ngos.find(n => n.id === selectedNGOId)?.workload}/{ngos.find(n => n.id === selectedNGOId)?.capacity} units</p>
                        <p className="text-xs text-slate-500">Contact: {ngos.find(n => n.id === selectedNGOId)?.contact}</p>
                      </div>
                    )}
                  </div>
                  <button 
                    disabled={!selectedNGOId}
                    onClick={handleAssignNGO}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Assign NGO
                  </button>
                </div>
              )}

              {/* Step 5: Forward */}
              {verificationStep === 5 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">5. Forward to NGO</h4>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Beneficiary</span>
                      <span className="text-xs font-bold text-slate-900">{app.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Device</span>
                      <span className="text-xs font-bold text-slate-900">{app.deviceRequested}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">Assigned NGO</span>
                      <span className="text-xs font-bold text-slate-900">{ngos.find(n => n.id === app.assignedNGOId || n.id === selectedNGOId)?.name}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleForwardToNGO}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Forward Application <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-red-500 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">Reject Application</h3>
                <button onClick={() => setShowRejectionModal(false)}><XCircle size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Reason for Rejection</label>
                  <select 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Insufficient disability percentage">Insufficient disability percentage</option>
                    <option value="Income exceeds limit">Income exceeds limit</option>
                    <option value="Incomplete/invalid documents">Incomplete/invalid documents</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {rejectionReason === 'Other' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Detailed Reason</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 h-24"
                      placeholder="Enter specific reason..."
                    />
                  </div>
                )}
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowRejectionModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectionReason}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};