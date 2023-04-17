import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
let persistor = persistStore(store);

root.render(
    <>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            </PersistGate>
        </Provider>
    </>
);
