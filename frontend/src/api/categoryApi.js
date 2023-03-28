import privateClient from 'api/config/privateClient';

const categoryApi = {
    getAll: params => privateClient.get('category', { params }),
    create: data => privateClient.post('category', data),
    update: (id, data) => privateClient.put(`category/${id}`, data),
    delete: id => privateClient.delete(`category/${id}`),
    search: value => privateClient.get('category/search', { params: { q: value } })
};

export default categoryApi;
