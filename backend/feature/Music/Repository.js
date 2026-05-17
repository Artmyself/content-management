const { query } = require('../../config/db');

class MusicRepository {
    async findByArtist(artistId) {
        return await query('SELECT * FROM music WHERE artist_id = $1', [artistId]);
    }
    async create(data) {
        return await query(
            'INSERT INTO music (artist_id, title, album_name, genre, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
            [data.artist_id, data.title, data.album_name, data.genre]
        );
    }
}
module.exports = new MusicRepository();