import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/lib/api';

export const fetchInvoices = createAsyncThunk(
    'invoices/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await api.getInvoices();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchInvoiceDetails = createAsyncThunk(
    'invoices/fetchDetails',
    async (id, { rejectWithValue }) => {
        try {
            return await api.getInvoice(id);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const invoiceSlice = createSlice({
    name: 'invoices',
    initialState: {
        items: [],
        currentInvoice: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentInvoice: (state) => {
            state.currentInvoice = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchInvoiceDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInvoiceDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentInvoice = action.payload;
                state.error = null;
            })
            .addCase(fetchInvoiceDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
