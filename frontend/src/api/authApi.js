import axios from 'axios';

import privateClient from 'api/config/privateClient';

const authApi = {
    register: data => privateClient.post('auth/register', data),
    login: data => privateClient.post('auth/login', data),
    isAuthenticated: () => privateClient.get('auth/activeUser'),
    refreshToken: data => privateClient.post('auth/refresh', data),
    // google login
    googleLogin: async accessToken =>
        (
            await axios
                .create({
                    baseURL: process.env.REACT_APP_API,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${accessToken}`
                    }
                })
                .post('auth/googleLogin')
        ).data
};

export default authApi;
