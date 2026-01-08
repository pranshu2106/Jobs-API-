import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

// Initial state
const initialState = {
    jobs: [],
    currentJob: null,
    isLoading: false,
    error: null,
    count: 0,
    filters: {
        search: '',
        status: 'all',
    },
};

// Async thunks
export const fetchJobs = createAsyncThunk(
    'jobs/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/jobs');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Failed to fetch jobs'
            );
        }
    }
);

export const fetchSingleJob = createAsyncThunk(
    'jobs/fetchSingle',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Failed to fetch job'
            );
        }
    }
);

export const createJob = createAsyncThunk(
    'jobs/create',
    async (jobData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Failed to create job'
            );
        }
    }
);

export const updateJob = createAsyncThunk(
    'jobs/update',
    async ({ jobId, jobData }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.patch(`/jobs/${jobId}`, jobData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Failed to update job'
            );
        }
    }
);

export const deleteJob = createAsyncThunk(
    'jobs/delete',
    async (jobId, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/jobs/${jobId}`);
            return jobId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Failed to delete job'
            );
        }
    }
);

// Slice
const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { search: '', status: 'all' };
        },
        clearCurrentJob: (state) => {
            state.currentJob = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all jobs
            .addCase(fetchJobs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobs = action.payload.jobs;
                state.count = action.payload.Count;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch single job
            .addCase(fetchSingleJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSingleJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentJob = action.payload.job;
            })
            .addCase(fetchSingleJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create job
            .addCase(createJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobs.unshift(action.payload.job);
                state.count += 1;
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update job
            .addCase(updateJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.jobs.findIndex(
                    (job) => job._id === action.payload.job._id
                );
                if (index !== -1) {
                    state.jobs[index] = action.payload.job;
                }
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete job
            .addCase(deleteJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobs = state.jobs.filter((job) => job._id !== action.payload);
                state.count -= 1;
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, clearCurrentJob, clearError } =
    jobsSlice.actions;
export default jobsSlice.reducer;
