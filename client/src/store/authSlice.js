import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';
import { saveToken, removeToken, getToken, getUserFromToken } from '../utils/authHelpers';

// Initial state
const initialState = {
    user: getUserFromToken(),
    token: getToken(),
    isLoading: false,
    error: null,
    isAuthenticated: !!getToken(),
};

// Async thunks
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/auth/register', userData);
            saveToken(response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Registration failed'
            );
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/auth/login', credentials);
            saveToken(response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || 'Login failed'
            );
        }
    }
);

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            removeToken();
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        loadUserFromToken: (state) => {
            const token = getToken();
            if (token) {
                state.user = getUserFromToken();
                state.token = token;
                state.isAuthenticated = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = { name: action.payload.user.name, ...getUserFromToken() };
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = { name: action.payload.user.name, ...getUserFromToken() };
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, loadUserFromToken } = authSlice.actions;
export default authSlice.reducer;
