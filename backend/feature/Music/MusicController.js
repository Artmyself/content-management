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

export const update = async (req, res) => {
    const { id } = req.params;
    const { title, album_name, genre } = req.body;
    try {
        await query(
            `UPDATE music SET title=$1, album_name=$2, genre=$3, updated_at=NOW() WHERE id=$4`,
            [title, album_name, genre, id]
        );
        res.json({ message: "Song updated" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        await query('DELETE FROM music WHERE id = $1', [req.params.id]);
        res.json({ message: "Song deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};