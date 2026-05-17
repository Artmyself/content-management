import { query } from '../../config/db.js';

export class ArtistRepository {
    static async findAll(limit, offset) {
        return await query('SELECT * FROM artist LIMIT $1 OFFSET $2', [limit, offset]);
    }

    // Fetches all artists for CSV export
    static async getAllExport() {
        return await query('SELECT name, dob, gender, address, first_release_year, no_of_albums_released FROM artist');
    }

    static async create(data) {
        const { name, dob, gender, address, first_release_year, no_of_albums_released } = data;
        return await query(
            `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
            [name, dob, gender, address, first_release_year, no_of_albums_released]
        );
    }
}