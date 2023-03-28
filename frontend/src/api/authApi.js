import privateClient from 'api/config/privateClient';

const authApi = {
    register: data => privateClient.post('auth/register', data),
    login: data => privateClient.post('auth/login', data),
    isAuthenticated: () => privateClient.get('auth/verify-token'),
    refreshToken: data => privateClient.post('auth/refresh', data),
    loginGoogle: () => privateClient.get('auth/google')
};

export default authApi;
