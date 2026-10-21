import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

const errorMessage = (error) => error.response?.data?.message || 'Unable to complete the request';

export const fetchNGOApplications = createAsyncThunk('ngo/fetchApplications', async (_, { rejectWithValue }) => {
  try { return (await axiosClient.get('/ngo/applications')).data.data; } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const fetchNGOApplication = createAsyncThunk('ngo/fetchApplication', async (id, { rejectWithValue }) => {
  try { return (await axiosClient.get(`/ngo/applications/${id}`)).data.data; } catch (error) { return rejectWithValue(errorMessage(error)); }
});
export const mutateNGOApplication = createAsyncThunk('ngo/mutateApplication', async ({ id, action, payload }, { rejectWithValue }) => {
  try {
    const config = payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
    return (await axiosClient.put(`/ngo/applications/${id}/${action}`, payload, config)).data.data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

const ngoSlice = createSlice({
  name: 'ngo', initialState: { applications: [], selected: null, loading: false, error: null },
  reducers: { clearNGOError: (state) => { state.error = null; } },
  extraReducers: (builder) => builder
    .addCase(fetchNGOApplications.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(fetchNGOApplications.fulfilled, (state, action) => { state.loading = false; state.applications = action.payload; })
    .addCase(fetchNGOApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    .addCase(fetchNGOApplication.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(fetchNGOApplication.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
    .addCase(fetchNGOApplication.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    .addCase(mutateNGOApplication.fulfilled, (state, action) => { state.selected = action.payload; state.loading = false; const index = state.applications.findIndex(item => item.applicationId === action.payload.applicationId); if (index >= 0) state.applications[index] = action.payload; })
    .addCase(mutateNGOApplication.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(mutateNGOApplication.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
});

export const { clearNGOError } = ngoSlice.actions;
export default ngoSlice.reducer;