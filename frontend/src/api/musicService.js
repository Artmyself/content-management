import api from './axiosInstance.js';

export const MusicService = {
    // List songs for a specific artist
    getByArtist: (artistId) => api.get(`/music/${artistId}`),

    // Create a new song record
    create: (data) => api.post('/music', data),

    // Delete a song record
    remove: (id) => api.delete(`/music/${id}`)
};