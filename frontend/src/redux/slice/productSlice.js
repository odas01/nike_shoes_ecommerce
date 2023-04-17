import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from 'api/productApi';

export const getProducts = createAsyncThunk('product/getAll', async (params, { rejectWithValue }) => {
    try {
        const res = await productApi.getAll(params);
        return res;
    } catch (err) {
        return rejectWithValue(err);
    }
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        items: [],
        total: 0
    },
    reducers: {}
});

export default productSlice.reducer;
