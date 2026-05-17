import { query } from '../../config/db.js';

export const getByArtist = async (req, res) => {
    const songs = await query('SELECT * FROM music WHERE artist_id = $1', [req.params.artistId]);
    res.json(songs);
};

export const create = async (req, res) => {
    const { artist_id, title, album_name, genre } = req.body;
    const song = await query(
        'INSERT INTO music (artist_id, title, album_name, genre, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
        [artist_id, title, album_name, genre]
    );
    res.status(201).json(song[0]);
};