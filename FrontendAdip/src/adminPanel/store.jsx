import { configureStore, createSlice } from "@reduxjs/toolkit";

/* ---------------- Application Status ---------------- */

export const ApplicationStatus = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  NGO_ASSIGNED: "NGO_ASSIGNED",
  PROCESSING_AT_NGO: "PROCESSING_AT_NGO",
  READY_FOR_DISTRIBUTION: "READY_FOR_DISTRIBUTION",
  DELIVERED: "DELIVERED",
  REJECTED: "REJECTED",
};

/* ---------------- Mock Data ---------------- */

const mockNGOs = [
  {
    id: "ngo-1",
    name: "Helping Hands Foundation",
    location: "New Delhi",
    deviceTypes: ["Wheelchair", "Hearing Aid"],
    workload: 12,
    capacity: 50,
    contact: "+91 98765 43210",
  },
  {
    id: "ngo-2",
    name: "Vision for All",
    location: "Mumbai",
    deviceTypes: ["Braille Kit", "Smart Cane"],
    workload: 8,
    capacity: 30,
    contact: "+91 98765 43211",
  },
  {
    id: "ngo-3",
    name: "Mobility Plus",
    location: "Bangalore",
    deviceTypes: ["Prosthetic Limb", "Crutches"],
    workload: 25,
    capacity: 40,
    contact: "+91 98765 43212",
  },
];


const mockApplications = [
  {
    id: 'ADIP-2024-001',
    applicantName: 'Rajesh Kumar',
    date: '2024-02-15',
    disabilityType: 'Locomotor',
    disabilityPercentage: 65,
    monthlyIncome: 12000,
    address: '123, Gandhi Nagar, Delhi',
    contact: '+91 99887 76655',
    deviceRequested: 'Motorized Wheelchair',
    deviceType: 'Locomotor Aid',
    estimatedCost: 35000,
    status: ApplicationStatus.PENDING_VERIFICATION,
    documents: [
      { id: 'doc1', name: 'Disability_Cert.pdf', type: 'disability', status: 'pending', url: '#' },
      { id: 'doc2', name: 'Income_Proof.jpg', type: 'income', status: 'pending', url: '#' },
      { id: 'doc3', name: 'Aadhar_Card.pdf', type: 'identity', status: 'pending', url: '#' },
    ],
    trackingHistory: [{ status: ApplicationStatus.PENDING_VERIFICATION, date: '2024-02-15' }],
  },
  {
    id: 'ADIP-2024-002',
    applicantName: 'Anita Sharma',
    date: '2024-02-18',
    disabilityType: 'Hearing Impairment',
    disabilityPercentage: 50,
    monthlyIncome: 8000,
    address: '45, Sector 12, Noida',
    contact: '+91 99887 76644',
    deviceRequested: 'Digital Hearing Aid',
    deviceType: 'Hearing Aid',
    estimatedCost: 15000,
    status: ApplicationStatus.APPROVED,
    documents: [],
    trackingHistory: [{ status: ApplicationStatus.PENDING_VERIFICATION, date: '2024-02-18' }, { status: ApplicationStatus.APPROVED, date: '2024-02-20' }],
  },
  {
    id: 'ADIP-2024-003',
    applicantName: 'Suresh Raina',
    date: '2024-02-10',
    disabilityType: 'Visual Impairment',
    disabilityPercentage: 100,
    monthlyIncome: 5000,
    address: '78, Model Town, Ludhiana',
    contact: '+91 99887 76633',
    deviceRequested: 'Smart Cane',
    deviceType: 'Visual Aid',
    estimatedCost: 8000,
    status: ApplicationStatus.NGO_ASSIGNED,
    assignedNGOId: 'ngo-2',
    documents: [],
    trackingHistory: [
      { status: ApplicationStatus.PENDING_VERIFICATION, date: '2024-02-10' },
      { status: ApplicationStatus.APPROVED, date: '2024-02-12' },
      { status: ApplicationStatus.NGO_ASSIGNED, date: '2024-02-14' }
    ],
  },
];

/* ---------------- Slice ---------------- */

const appSlice = createSlice({
  name: "app",
  initialState: {
    applications: mockApplications,
    ngos: mockNGOs,
    // REMOVED: isAuthenticated: false,
    // REMOVED: currentUser: null,
  },
  reducers: {
    // REMOVED: login reducer
    // REMOVED: logout reducer
    
    updateApplicationStatus: (state, action) => {
      const app = state.applications.find(
        (a) => a.id === action.payload.id
      );

      if (app) {
        app.status = action.payload.status;

        if (action.payload.rejectionReason)
          app.rejectionReason = action.payload.rejectionReason;

        if (action.payload.ngoId)
          app.assignedNGOId = action.payload.ngoId;

        app.trackingHistory.push({
          status: action.payload.status,
          date: new Date().toISOString().split("T")[0],
          comment: action.payload.comment,
        });
      }
    },

    verifyDocument: (state, action) => {
      const app = state.applications.find(
        (a) => a.id === action.payload.appId
      );

      if (app) {
        const doc = app.documents.find(
          (d) => d.id === action.payload.docId
        );
        if (doc) doc.status = action.payload.status;
      }
    },
  },
});

/* ---------------- Exports ---------------- */

export const {
  // REMOVED: login,
  // REMOVED: logout,
  updateApplicationStatus,
  verifyDocument,
} = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});