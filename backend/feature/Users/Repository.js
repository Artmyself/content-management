import { query } from '../../config/db.js';

export class UserRepository {
    static async findAll(limit, offset) {
        return await query('SELECT id, first_name, last_name, email, role FROM "user" LIMIT $1 OFFSET $2', [limit, offset]);
    }
    static async count() {
        const res = await query('SELECT COUNT(*) FROM "user"');
        return parseInt(res[0].count);
    }
}