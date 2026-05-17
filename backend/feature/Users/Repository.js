const { query } = require('../../config/db');

class UserRepository {
    async findAll(limit, offset) {
        return await query('SELECT id, first_name, last_name, email, role FROM "user" LIMIT $1 OFFSET $2', [limit, offset]);
    }
    async count() {
        const res = await query('SELECT COUNT(*) FROM "user"');
        return parseInt(res[0].count);
    }
    async delete(id) {
        return await query('DELETE FROM "user" WHERE id = $1', [id]);
    }
}
module.exports = new UserRepository();