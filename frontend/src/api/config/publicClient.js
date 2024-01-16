import axios from 'axios';

const publicClient = axios.create({
    baseURL: process.env.REACT_APP_API
});

publicClient.interceptors.request.use(async config => {
    return {
        ...config,
        headers: {
            'Content-Type': 'application/json'
        }
    };
});

publicClient.interceptors.response.use(
    response => {
        if (response && response.data) return response.data;
        return response;
    },
    err => {
        throw err.response.data;
    }
);

export default publicClient;
