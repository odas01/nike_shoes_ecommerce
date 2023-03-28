import privateClient from 'api/config/privateClient';
import publicClient from './config/publicClient';

const productApi = {
    getAll: params => publicClient.get('products', { params }),
    create: data => privateClient.post('products', data),

    get: slug => privateClient.get(`products/d/${slug}`),
    update: (slug, data) => privateClient.put(`products/d/${slug}`, data),
    delete: slug => privateClient.delete(`products/d/${slug}`),

    related: (slug, category) => publicClient.get('products/related', { params: { slug, category } }),
    popular: () => publicClient.get('products/popular')
};

export default productApi;
