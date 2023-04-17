import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './slice/authSlice';
import categorySlice from './slice/categorySlice';
import cartSlice from './slice/cartSlice';
import productSlice from './slice/productSlice';

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
