import axios from 'axios';

import authApi from 'api/authApi';

const baseUrl = 'http://127.0.0.1:3000/api/';
const getAccessToken = () => localStorage.getItem('ACCESS_TOKEN');
const getRefreshToken = () => localStorage.getItem('REFRESH_TOKEN');

let refresh = false;

const privateClient = axios.create({
    baseURL: baseUrl
});

privateClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getAccessToken()}`
        }
    };
});

privateClient.interceptors.response.use(
    response => {
        if (response && response.data) return response.data;
        return response;
    },
    async err => {
        if (err.response.status === 401) {
            const token = getRefreshToken();
            if (token && !refresh) {
                refresh = true;
                try {
                    const res = await authApi.refreshToken({ rftoken: token });
                    localStorage.setItem('ACCESS_TOKEN', res.accessToken);
                    localStorage.setItem('REFRESH_TOKEN', res.refreshToken);

                    refresh = false;
                    return privateClient(err.config);
                } catch (err) {
                    localStorage.removeItem('ACCESS_TOKEN');
                    localStorage.removeItem('REFRESH_TOKEN');

                    window.location.replace('/login');
                }
            }
        }
        throw err.response.data;
    }
);

export default privateClient;
