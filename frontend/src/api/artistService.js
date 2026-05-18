import api from './axiosInstance.js';

export const ArtistService = {
    list: (search = '', page = 1) => api.get('/artists', { params: { search, page } }),
    create: (data) => api.post('/artists', data),

    /**
     * Download artist list as CSV
     * Access: super_admin, artist_manager
     */
    exportCSV: () =>
        api.get('/artists/export', {
            responseType: 'blob' // Important for file downloads
        }),

    /**
     * Upload CSV to bulk create artists
     * Access: artist_manager only
     */
    importCSV: (formData) =>
        api.post('/artists/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
};