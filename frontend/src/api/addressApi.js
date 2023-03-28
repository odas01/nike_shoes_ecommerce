import axios from 'axios';
const axiosApi = axios.create({
    baseURL: 'https://provinces.open-api.vn/api/'
});

const addressApi = {
    getProvinces: async () => (await axiosApi.get('/')).data,
    getDistricts: async code => (await axiosApi.get('/p/' + code + '?depth=2')).data,
    getWards: async code => (await axiosApi.get('/d/' + code + '?depth=2')).data
};

export default addressApi;
