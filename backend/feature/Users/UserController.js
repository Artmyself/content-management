import { query } from '../../config/db.js';
import bcrypt from 'bcryptjs';

// 1. List User records with pagination [Role Access: super_admin]
export const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Fetch paginated users
        const users = await query(
            `SELECT id, first_name, last_name, email, phone, dob, gender, "Address", role, created_at 
             FROM "user" 
             ORDER BY created_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        // Fetch total count for pagination metadata
        const countResult = await query('SELECT COUNT(*) FROM "user"');
        const total = parseInt(countResult[0].count);

        res.status(200).json({
            data: users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users: " + err.message });
    }
};

// 2. Create a new user record [Role Access: super_admin]
export const create = async (req, res) => {
    const {
        first_name, last_name, email, password, phone,
        dob, gender, address, role
    } = req.body;

    try {
        // Basic Validation
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password, and role are required." });
        }

        // Check if email already exists
        const existing = await query('SELECT id FROM "user" WHERE email = $1', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await query(
            `INSERT INTO "user" (
                first_name, last_name, email, password, phone, 
                dob, gender, "Address", role, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
            RETURNING id, email, role`,
            [first_name, last_name, email, hashedPassword, phone, dob, gender, address, role]
        );

        res.status(201).json({
            message: "User created successfully",
            user: newUser[0]
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to create user: " + err.message });
    }
};

// 3. Update existing user record [Role Access: super_admin]
export const update = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone, dob, gender, address, role } = req.body;

    try {
        const updatedUser = await query(
            `UPDATE "user" 
             SET first_name = $1, last_name = $2, phone = $3, dob = $4, 
                 gender = $5, "Address" = $6, role = $7, updated_at = NOW()
             WHERE id = $8 
             RETURNING id, first_name, last_name, role`,
            [first_name, last_name, phone, dob, gender, address, role, id]
        );

        if (updatedUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser[0]
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user: " + err.message });
    }
};

// 4. Delete existing user record [Role Access: super_admin]
export const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await query('DELETE FROM "user" WHERE id = $1 RETURNING id', [id]);

        if (deleted.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user: " + err.message });
    }
};

// Helper: Get Single User for Edit Profile/Detail
export const getById = async (req, res) => {
    try {
        const user = await query(
            'SELECT id, first_name, last_name, email, phone, dob, gender, "Address", role FROM "user" WHERE id = $1',
            [req.params.id]
        );
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(user[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};