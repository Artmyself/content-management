import { query } from '../../config/db.js';

export const getStats = async (req, res) => {
    try {
        const [userCount, artistCount, songCount, latestSongs] = await Promise.all([
            query('SELECT COUNT(*) FROM "user"'),
            query('SELECT COUNT(*) FROM artist'),
            query('SELECT COUNT(*) FROM music'),
            query(`SELECT m.*, a.name as artist_name 
                   FROM music m 
                   JOIN artist a ON m.artist_id = a.id 
                   ORDER BY m.created_at DESC LIMIT 5`)
        ]);

        res.json({
            users: parseInt(userCount[0].count),
            artists: parseInt(artistCount[0].count),
            songs: parseInt(songCount[0].count),
            latestSongs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};