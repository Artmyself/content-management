const { query } = require('../../config/db');

class ArtistRepository {
    async findAll(limit, offset) {
        return await query('SELECT * FROM artist LIMIT $1 OFFSET $2', [limit, offset]);
    }
    async create(data) {
        const { name, dob, gender, address, first_release_year, no_of_albums_released } = data;
        return await query(
            `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
            [name, dob, gender, address, first_release_year, no_of_albums_released]
        );
    }
}
module.exports = new ArtistRepository();