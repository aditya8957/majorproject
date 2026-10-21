import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyDocumentStatus , updateApplicationStatus, fetchDocument, verifyDistribution, fetchApplicationById } from '../../store';
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
  ChevronRight,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from '../../component/StatusBadge';
import { motion, AnimatePresence } from "framer-motion";
import { normalizeApplicationStatus } from '../../../utils/applicationStatus';
import { APPLICATION_STATUS } from '../../../utils/applicationStatus';

const getAdminWorkflowStage = (application) => {
  const status = normalizeApplicationStatus(application?.status);
  if (status === 'rejected') return 0;
  if (['proof_submitted', 'proof_rejected'].includes(status)) return 6;
  if (status === 'completed') return 7;
  if (['ngo_assigned', 'processing_at_ngo', 'aid_preparation', 'aid_ready', 'out_for_delivery', 'delivered'].includes(status)) return 5;
  if (status === 'approved') return 4;
  if (status === 'under_review') return 2;
  return 1;
};

export const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  Redux state
  const { loading, ngoRegistrationRequests, selectedApplication } = useSelector((state) => state.app);
  const app = selectedApplication?.id === id ? selectedApplication : null;

  useEffect(() => {
    dispatch(fetchApplicationById(id));
  }, [dispatch, id]);

  const ngos = useSelector((state) => state.app.ngos);

  // Approved NGOs coming from registration requests (map to unified shape)
  const approvedNGOs = (ngoRegistrationRequests?.approved || []).map(ngo => ({
    id: ngo._id,
    name: ngo.ngoName,
    location: `${ngo.state}, ${ngo.district}`,
    contact: ngo.phone,
    address: ngo.address,
    registrationNumber: ngo.registrationNumber,
    status: 'approved',
    approvedAt: ngo.approvedAt,
    documents: ngo.documents
  }));

  // Combine existing NGOs with newly approved ones (avoid duplicates by id)
  const availableNGOs = Array.from(new Map([
    ...ngos.map(n => [n.id, n]),
    ...approvedNGOs.map(n => [n.id, n])
  ]).values());

  const verificationStep = getAdminWorkflowStage(app);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedNGOId, setSelectedNGOId] = useState('');
  const [assigningNGO, setAssigningNGO] = useState(false);
  const assigningNGOLock = React.useRef(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showDocVerifyModal, setShowDocVerifyModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docRejectionReason, setDocRejectionReason] = useState('');
  const [distributionComment, setDistributionComment] = useState('');

  if (loading && !app) return <div>Loading application...</div>;
  if (!app) return <div>Application not found</div>;

  const isEligible =
    app.disabilityPercentage >= 30 &&
    app.monthlyIncome < 20000;

  const handleViewDocument = async (doc) => {
    try {
      if (doc.url) {
        window.open(doc.url, '_blank', 'noopener,noreferrer');
      } else {
        const docData = await dispatch(fetchDocument(app.id));
        if (docData?.fileUrl) {
          window.open(docData.fileUrl, '_blank');
        } else {
          alert('PDF URL not available');
        }
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Failed to open PDF');
    }
  };

 
  const handleVerifyDoc = (doc, status) => {
    setSelectedDoc(doc);
    
    if (status === 'rejected') {
      setShowDocVerifyModal(true);
    } else {
      // Document verify karo
      dispatch(verifyDocumentStatus({
        appId: app.id,
        docId: doc.id,
        status: 'verified'
      })).then((result) => {
        if (result.success) {
          console.log('✅ Document verified successfully');
        
        }
      });
    }
  };


  const handleDocVerification = () => {
    if (selectedDoc) {
      dispatch(verifyDocumentStatus({
        appId: app.id,
        docId: selectedDoc.id,
        status: 'rejected',
        rejectionReason: docRejectionReason
      })).then((result) => {
        if (result.success) {
          setShowDocVerifyModal(false);
          setSelectedDoc(null);
          setDocRejectionReason('');
          // FORCE UI UPDATE
        }
      });
    }
  };

  const handleApprove = async () => {
    await dispatch(
      updateApplicationStatus({
        id: app.id,
        status: APPLICATION_STATUS.APPROVED
      })
    );
  };

  const handleReject = async () => {
    const result = await dispatch(
      updateApplicationStatus({
        id: app.id,
        status: APPLICATION_STATUS.REJECTED,
        rejectionReason
      })
    );
    if (result.success) {
      setShowRejectionModal(false);
      navigate('/admin/applications');
    }
  };

  const handleAssignNGO = async () => {
    if (!selectedNGOId || assigningNGOLock.current) return;

    assigningNGOLock.current = true;
    setAssigningNGO(true);
    try {
      await dispatch(
        updateApplicationStatus({
          id: app.id,
          status: APPLICATION_STATUS.NGO_ASSIGNED,
          ngoId: selectedNGOId
        })
      );
    } finally {
      assigningNGOLock.current = false;
      setAssigningNGO(false);
    }
  };

  const handleForwardToNGO = async () => {
    const result = await dispatch(
      updateApplicationStatus({
        id: app.id,
        status: APPLICATION_STATUS.PROCESSING_AT_NGO
      })
    );
    if (result.success) navigate('/admin/applications');
  };

  const handleDistributionVerification = (status) => {
    if (status === 'rejected' && !distributionComment.trim()) return;
    dispatch(verifyDistribution({ id: app.id, status, comment: distributionComment.trim() })).then((result) => {
      if (result.success) setDistributionComment('');
    });
  };

 
  const allDocumentsVerified = app?.documents?.every(doc => doc.status === 'verified') || false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/applications')}
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
        {/* <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600"><Printer size={20} /></button>
          <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
        </div> */}
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
              {/* <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</p>
                <p className="text-2xl font-bold text-emerald-600">₹{app.estimatedCost.toLocaleString()}</p>
              </div> */}
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
                <div 
                  key={`${doc.id}-${doc.status}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{doc.type.replace(/_/g, ' ')}</p>
                      {/* Document status badge */}
                      {doc.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          <Check size={12} /> Verified
                        </span>
                      )}
                      {doc.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                      {doc.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          <AlertCircle size={12} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* View Document Button */}
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Document"
                    >
                      <Eye size={20} />
                    </button>
                    
                    {/* Download Button */}
                    <button 
                      onClick={() => window.open(doc.url, '_blank')}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>

                    {/* Verification Buttons - Only show if pending */}
                    {doc.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleVerifyDoc(doc, 'verified')}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Verify Document"
                        >
                          <Check size={20} />
                        </button>
                        <button 
                          onClick={() => handleVerifyDoc(doc, 'rejected')}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Reject Document"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
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
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1.5 flex-1 rounded-full ${s <= verificationStep ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8 space-y-8">
              {(verificationStep === 6 || verificationStep === 7) && (
                <div className="mb-6 space-y-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                  <h4 className="font-bold text-orange-900">{verificationStep === 7 ? 'Distribution Completed' : normalizeApplicationStatus(app.status) === 'proof_rejected' ? 'Proof Rejected - Awaiting NGO Resubmission' : 'Distribution Verification'}</h4>
                  {app.distributionProof?.fileUrl && <a href={app.distributionProof.fileUrl} target="_blank" rel="noreferrer" className="font-semibold text-orange-800 underline">View distribution proof</a>}
                  {verificationStep === 6 && normalizeApplicationStatus(app.status) === 'proof_submitted' && <><textarea value={distributionComment} onChange={(event) => setDistributionComment(event.target.value)} placeholder="Verification comment (optional for approval, required for rejection)" className="w-full rounded-xl border border-orange-200 p-3" /><div className="flex gap-3"><button onClick={() => handleDistributionVerification('verified')} className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Approve Distribution</button><button disabled={!distributionComment.trim()} onClick={() => handleDistributionVerification('rejected')} className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:opacity-40">Reject / Re-upload</button></div></>}
                </div>
              )}

              {/* Step 1: Document Verification */}
              {verificationStep === 1 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">1. Document Verification</h4>
                  
                  {/* Document Checklist */}
                  <div className="space-y-4">
                    {app.documents.map(doc => {
                      const isVerified = doc.status === 'verified';
                      const isRejected = doc.status === 'rejected';
                      
                      return (
                        <div 
                          key={`${doc.id}-${doc.status}`}
                          className="flex items-center gap-3"
                        >
                          {/* Tick Circle - YAHI TICK HOGA */}
                          <div className={`
                            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                            ${isVerified 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : isRejected
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'border-slate-200'
                            }
                          `}>
                            {isVerified && <Check size={14} />}
                            {isRejected && <XCircle size={14} />}
                          </div>
                          
                          <span className={`
                            text-sm font-medium
                            ${isVerified ? 'text-slate-900' : 'text-slate-500'}
                          `}>
                            Disability Proof
                          </span>
                          
                          {isRejected && (
                            <span className="text-xs text-red-500 ml-auto">
                              Rejected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  <button 
                    disabled={!allDocumentsVerified}
                    onClick={() => {
                      if (allDocumentsVerified) {
                        dispatch(fetchApplicationById(app.id));
                      }
                    }}
                    className={`
                      w-full font-bold py-3 rounded-xl transition-all
                      ${allDocumentsVerified 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Continue to Eligibility
                  </button>

                  {!allDocumentsVerified && (
                    <p className="text-xs text-amber-600 text-center">
                      Please verify all documents before proceeding
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Eligibility Calculator */}
              {verificationStep === 2 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900">2. Eligibility Verification</h4>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Disability % (≥30)</span>
                      <span className={`font-bold ${app.disabilityPercentage >= 30 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {app.disabilityPercentage}% {app.disabilityPercentage >= 30 ? '✓' : '✗'}
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
                      onClick={handleApprove}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Approve Application
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
                    {approvedNGOs.length === 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                        No approved NGOs available. Approve NGOs from the NGO management panel before assigning.
                      </div>
                    )}
                    <select 
                      value={selectedNGOId}
                      onChange={(e) => setSelectedNGOId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select an Approved NGO...</option>
                      {approvedNGOs.length > 0 ? (
                        approvedNGOs.map(ngo => (
                          <option key={ngo.id} value={ngo.id}>
                            {ngo.name} ({ngo.location}) - Approved
                          </option>
                        ))
                      ) : (
                        <option disabled>No approved NGOs available</option>
                      )}
                      
                      {/* Show legacy NGOs under an optgroup for reference */}
                      {ngos && ngos.length > 0 && (
                        <optgroup label="Other Agencies">
                          {ngos.map(ngo => (
                            <option key={ngo.id} value={ngo.id}>
                              {ngo.name} ({ngo.location})
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {selectedNGOId && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        {(() => {
                          const selectedNGO = availableNGOs.find(n => n.id === selectedNGOId);
                          return selectedNGO ? (
                            <>
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{selectedNGO.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">{selectedNGO.location}</p>
                                </div>
                                {selectedNGO.status === 'approved' && (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">
                                    ✓ Approved
                                  </span>
                                )}
                              </div>
                              <div className="pt-2 border-t border-slate-200 space-y-2">
                                <p className="text-xs text-slate-500">Contact: {selectedNGO.contact}</p>
                                {selectedNGO.address && (
                                  <p className="text-xs text-slate-500">Address: {selectedNGO.address}</p>
                                )}
                                {selectedNGO.registrationNumber && (
                                  <p className="text-xs text-slate-500">Reg #: {selectedNGO.registrationNumber}</p>
                                )}
                                {selectedNGO.workload !== undefined && selectedNGO.capacity !== undefined && (
                                  <p className="text-xs text-slate-500">Workload: {selectedNGO.workload}/{selectedNGO.capacity} units</p>
                                )}
                              </div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={!selectedNGOId || assigningNGO}
                    onClick={handleAssignNGO}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    {assigningNGO ? 'Assigning...' : 'Assign NGO'}
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
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Assigned NGO</span>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{app.ngo?.ngoName || availableNGOs.find(n => n.id === selectedNGOId)?.name || 'Assigned NGO'}</p>
                        {(app.ngo?.ngoName || availableNGOs.find(n => n.id === selectedNGOId)) && (
                          <span className="text-xs text-emerald-600 font-medium">✓ Approved NGO</span>
                        )}
                      </div>
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

      {/* Document Rejection Modal */}
      <AnimatePresence>
        {showDocVerifyModal && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-red-500 text-white">
                <h3 className="text-lg font-bold">Reject Document</h3>
                <p className="text-sm text-red-100 mt-1">
                  Application will be rejected permanently
                </p>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    Rejecting: <span className="font-bold">{selectedDoc.name}</span>
                  </p>
                  <button
                    onClick={() => handleViewDocument(selectedDoc)}
                    className="w-full mb-4 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-700 font-medium transition-all"
                  >
                    <Eye size={18} />
                    View Document
                  </button>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>
                      <strong>Note:</strong> Rejecting this document will also reject the entire application. 
                      This action cannot be undone.
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Reason for Rejection</label>
                  <textarea 
                    value={docRejectionReason}
                    onChange={(e) => setDocRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this document..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 h-24"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setShowDocVerifyModal(false);
                      setSelectedDoc(null);
                      setDocRejectionReason('');
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDocVerification}
                    disabled={!docRejectionReason || loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Rejecting...
                      </>
                    ) : (
                      'Confirm Rejection'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Rejection Modal */}
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
                      value={docRejectionReason}
                      onChange={(e) => setDocRejectionReason(e.target.value)}
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