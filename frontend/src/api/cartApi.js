import privateClient from 'api/config/privateClient';

const cartApi = {
    get: async () => await privateClient.get(`carts`),
    create: async data => await privateClient.post(`carts`, data),
    delete: async () => await privateClient.delete(`carts`),
    updateItem: async (itemId, data) => await privateClient.put(`carts/${itemId}`, data),
    deleteItem: async itemId => await privateClient.delete(`carts/${itemId}`)
};

export default cartApi;
