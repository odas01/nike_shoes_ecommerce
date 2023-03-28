import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './authSlice';
import categorySlice from './categorySlice';
import cartSlice from './cartSlice';
import productSlice from './productSlice';

const rootPersistConfig = {
    key: 'root',
    storage,
    blacklist: ['auth']
};

const authPersistConfig = {
    key: 'auth',
    storage,
    blacklist: 'isAuth'
};

const reducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    category: categorySlice,
    cart: cartSlice,
    product: productSlice
});

const persistedReducer = persistReducer(rootPersistConfig, reducer);

export default configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
