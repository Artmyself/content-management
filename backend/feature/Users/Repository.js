import { query } from '../../config/db.js';

export class UserRepository {
    static async findAll(limit, offset) {
        return await query('SELECT id, first_name, last_name, email, role FROM "user" LIMIT $1 OFFSET $2', [limit, offset]);
    }
    static async getAll(search = '', page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        // Get paginated data
        const dataSql = `SELECT id, full_name, email, role FROM "user" 
                         WHERE full_name ILIKE $1 OR email ILIKE $1 
                         ORDER BY created_at DESC LIMIT $2 OFFSET $3`;

        // Get total count for frontend pagination logic
        const countSql = `SELECT COUNT(*) FROM "user" WHERE full_name ILIKE $1 OR email ILIKE $1`;

        const [rows, countResult] = await Promise.all([
            query(dataSql, [`%${search}%`, limit, offset]),
            query(countSql, [`%${search}%`])
        ]);

        return {
            users: rows,
            total: parseInt(countResult[0].count)
        };
    }
    static async count() {
        const res = await query('SELECT COUNT(*) FROM "user"');
        return parseInt(res[0].count);
    }
}