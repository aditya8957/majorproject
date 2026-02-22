import { configureStore, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Add token from localStorage to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url, 'with token:', token ? 'Yes' : 'No');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized! Token might be invalid or expired');
      // Optionally redirect to login
      // window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

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

/* ---------------- Initial State ---------------- */

const initialState = {
  applications: [],
  ngos: [],
  selectedApplication: null,
  loading: false,
  error: null,
  dashboardStats: {
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      processing: 0
    },
    chartData: [],
    pieData: []
  }
};

/* ---------------- Slice ---------------- */

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
      state.loading = false;
    },
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
      state.loading = false;
    },
    updateApplicationInList: (state, action) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    setNGOs: (state, action) => {
      state.ngos = action.payload;
    },
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    updateDocumentStatus: (state, action) => {
      const { applicationId, documentId, status } = action.payload;
      
      const app = state.applications.find(a => a.id === applicationId);
      if (app) {
        const doc = app.documents?.find(d => d.id === documentId);
        if (doc) doc.status = status;
      }

      if (state.selectedApplication?.id === applicationId) {
        const doc = state.selectedApplication.documents?.find(d => d.id === documentId);
        if (doc) doc.status = status;
      }
    }
  }
});

/* ---------------- Actions ---------------- */

export const {
  setLoading,
  setError,
  setApplications,
  setSelectedApplication,
  updateApplicationInList,
  setNGOs,
  setDashboardStats,
  updateDocumentStatus  
} = appSlice.actions;

/* ---------------- API Calls ---------------- */

// Fetch all applications
export const fetchApplications = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/admin/applications');
    dispatch(setApplications(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to fetch applications'));
  }
};

// Fetch single application
export const fetchApplicationById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(`/admin/applications/${id}`);
    dispatch(setSelectedApplication(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to fetch application'));
  }
};

// Update application status
export const updateApplicationStatus = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.put(`/admin/applications/${data.id}/status`, data);
    dispatch(fetchApplications()); // Refresh the list
    dispatch(setLoading(false));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to update status'));
    return { success: false };
  }
};



// Fetch document for viewing
export const fetchDocument = (applicationId) => async (dispatch) => {
  try {
    const response = await api.get(`/admin/applications/${applicationId}/document`);
    return response.data;
  } catch (error) {
    dispatch(setError('Failed to fetch document'));
    return null;
  }
};

export const verifyDocumentStatus = (data) => async (dispatch) => {
  try {
    
    const appId = String(data.appId);
    
    dispatch(setLoading(true));
    
    // 1. Verify document
    const response = await api.put(`/admin/applications/${appId}/verify-document`, {
      status: data.status,
      rejectionReason: data.rejectionReason || ''
    });
    
 
    // 2. Updated application data
    const updatedApp = response.data.application;
    
    // 3. Update Redux store with FRESH data
    dispatch(setSelectedApplication(updatedApp));
    
    // 4. Update applications list bhi
    const appsResponse = await api.get('/admin/applications');
    dispatch(setApplications(appsResponse.data));
    
    dispatch(setLoading(false));
    
    // 5. Success message
    console.log('Document verified successfully');
    
    return { success: true };
  } catch (error) {
    
    dispatch(setError(error.response?.data?.message || 'Failed to verify document'));
    return { success: false };
  }
};

// Fetch NGOs
export const fetchNGOs = () => async (dispatch) => {
  try {
    const response = await api.get('/admin/ngos');
    dispatch(setNGOs(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to fetch NGOs'));
  }
};

// Assign NGO
export const assignNGO = (applicationId, ngoId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.post(`/admin/applications/${applicationId}/assign-ngo`, { ngoId });
    dispatch(fetchApplications()); // Refresh the list
    dispatch(setLoading(false));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to assign NGO'));
    return { success: false };
  }
};

// Fetch dashboard stats
export const fetchDashboardStats = () => async (dispatch) => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    dispatch(setDashboardStats(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Failed to fetch stats'));
  }
};

/* ---------------- Store ---------------- */

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});