import api from './axiosInstance.js';

export const UserService = {
    list: (search = '', page = 1) => api.get('/users', { params: { search, page } }),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    remove: (id) => api.delete(`/users/${id}`),
    exportCSV: () => api.get('/users/export', { responseType: 'blob' }),
    importCSV: (formData) => api.post('/users/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};