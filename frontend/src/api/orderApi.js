import privateClient from 'api/config/privateClient';

const orderApi = {
    getAll: params => privateClient.get('orders', { params }),
    create: data => privateClient.post('orders', data),
    get: (id, data) => privateClient.get(`orders/${id}`, data),
    delete: (id, data) => privateClient.delete(`orders/${id}`),
    update: (id, data) => privateClient.put(`orders/${id}`, data),
    search: params => privateClient.get('orders/search', { params })
};

export default orderApi;
