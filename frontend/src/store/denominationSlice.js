import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/lib/api';

export const fetchDenominations = createAsyncThunk(
    'denominations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await api.getDenominations();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateDenominationCount = createAsyncThunk(
    'denominations/update',
    async ({ id, count }, { rejectWithValue, dispatch }) => {
        try {
            const result = await api.updateDenomination(id, count);
            dispatch(fetchDenominations());
            return result;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const denominationSlice = createSlice({
    name: 'denominations',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDenominations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDenominations.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDenominations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default denominationSlice.reducer;
