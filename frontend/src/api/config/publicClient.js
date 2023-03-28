import axios from 'axios';

const baseUrl = 'http://127.0.0.1:3000/api/';

const publicClient = axios.create({
    baseURL: baseUrl
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
