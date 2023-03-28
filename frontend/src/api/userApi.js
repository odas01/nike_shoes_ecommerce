import privateClient from 'api/config/privateClient';

const userApi = {
    getAll: async () => await privateClient.get('users'),
    get: async id => await privateClient.get(`users/${id}`),
    update: async (id, data) => await privateClient.put(`users/${id}`, data),
    delete: async id => await privateClient.delete(`users/${id}`),
    search: async value =>
        await privateClient.get(`users/search`, {
            params: {
                q: value
            }
        })
};

export default userApi;
