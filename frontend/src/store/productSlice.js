import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/lib/api';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await api.getProducts();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (productData, { rejectWithValue, dispatch }) => {
        try {
            const result = await api.createProduct(productData);
            dispatch(fetchProducts());
            return result;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const removeProduct = createAsyncThunk(
    'products/remove',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await api.deleteProduct(id);
            dispatch(fetchProducts());
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const editProduct = createAsyncThunk(
    'products/edit',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const result = await api.updateProduct(id, data);
            dispatch(fetchProducts());
            return result;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
