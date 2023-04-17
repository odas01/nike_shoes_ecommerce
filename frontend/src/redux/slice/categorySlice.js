import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import categoryApi from 'api/categoryApi';

export const getCategories = createAsyncThunk('category/get', async (_, { rejectWithValue }) => {
    try {
        const res = await categoryApi.getAll();
        return res;
    } catch (err) {
        rejectWithValue(err);
    }
});
const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        genders: []
    },
    reducers: [],
    extraReducers: builders => {
        builders.addCase(getCategories.fulfilled, (state, { payload }) => {
            state.categories = payload.categories;
            state.genders = payload.genders;
        });
    }
});

export default categorySlice.reducer;
