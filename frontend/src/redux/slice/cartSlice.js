import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import cartApi from 'api/cartApi';

export const getCart = createAsyncThunk('cart/get', async (userId, { rejectWithValue }) => {
    try {
        const res = await cartApi.get(userId);
        return res;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const deleteCart = createAsyncThunk('cart/delete', async (values, { rejectWithValue, dispatch }) => {
    try {
        const res = await cartApi.delete();
        dispatch(removeCart());
        return res;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const createItem = createAsyncThunk('item/create', async (values, { rejectWithValue }) => {
    try {
        const res = await cartApi.create(values);
        return res;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const updateItem = createAsyncThunk('item/update', async ({ itemId, qty }, { rejectWithValue, dispatch }) => {
    try {
        const res = await cartApi.updateItem(itemId, { qty });
        dispatch(updateCart(res.item));
        return res;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const deleteItem = createAsyncThunk('item/delete', async (values, { rejectWithValue }) => {
    try {
        await cartApi.deleteItem(values);
        return values;
    } catch (err) {
        return rejectWithValue(err);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        qty: 0
    },
    reducers: {
        removeCart: state => {
            state.items = [];
            state.qty = 0;
        },
        updateCart: (state, { payload }) => {
            const foundIndex = state.items.findIndex(item => item._id === payload._id);
            state.items[foundIndex] = payload;
        }
    },
    extraReducers: builders => {
        builders
            .addCase(getCart.fulfilled, (state, { payload }) => {
                state.items = payload.items;
                state.qty = payload.total;
            })
            .addCase(deleteItem.fulfilled, (state, { payload: id }) => {
                state.items = state.items.filter(item => item._id !== id);
                state.qty -= 1;
            });
    }
});
export const { removeCart, updateCart } = cartSlice.actions;

export default cartSlice.reducer;
