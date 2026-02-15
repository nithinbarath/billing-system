import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/lib/api';

export const loginAdmin = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            return await api.login(username, password);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const logoutAdmin = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await api.logout();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchAdminMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            return await api.getAdminMe();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        admin: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Me
            .addCase(fetchAdminMe.fulfilled, (state, action) => {
                state.admin = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchAdminMe.rejected, (state) => {
                state.admin = null;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
