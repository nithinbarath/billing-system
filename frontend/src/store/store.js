import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice';
import productReducer from './productSlice';
import denominationReducer from './denominationSlice';
import invoiceReducer from './invoiceSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        products: productReducer,
        denominations: denominationReducer,
        invoices: invoiceReducer,
    },
});
