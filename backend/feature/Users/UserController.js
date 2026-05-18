import { query } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import { UserService } from './Service.js';
import { UserRepository } from './Repository.js';
import { Parser } from 'json2csv';
import fs from 'fs';
import csv from 'csv-parser';

// 1. List User records [Role Access: super_admin]
export const list = async (req, res) => {
    try {
        // Updated to strictly use full_name
        const users = await query(
            'SELECT id, full_name, email, role, created_at FROM "user" ORDER BY created_at DESC',
            []
        );
        res.json(users);
    } catch (err) {
        console.error("User List Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. Create a new user record [Role Access: super_admin]
export const create = async (req, res) => {
    const { full_name, email, password, role } = req.body;

    try {
        // Validation for full_name and other required fields
        if (!full_name || !email || !password || !role) {
            return res.status(400).json({ message: "Full Name, email, password, and role are required." });
        }

        // Check if email already exists
        const existing = await query('SELECT id FROM "user" WHERE email = $1', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Updated query to use full_name
        const newUser = await query(
            `INSERT INTO "user" (full_name, email, password, role, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, full_name, role`,
            [full_name, email, hashedPassword, role]
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
    const { full_name, role, email } = req.body;

    try {
        // Updated SQL to use full_name instead of first/last name
        const updatedUser = await query(
            `UPDATE "user" 
             SET full_name = $1, role = $2, email = $3, updated_at = NOW()
             WHERE id = $4 
             RETURNING id, full_name, email, role`,
            [full_name, role, email, id]
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

export const exportCSV = async (req, res) => {
    try {
        const users = await UserService.listUsers(''); // Get all users
        const fields = ['full_name', 'email', 'role'];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users_export.csv');
        return res.send(csvData);
    } catch (err) {
        res.status(500).json({ error: "Export failed: " + err.message });
    }
};

// --- IMPORT USERS FROM CSV ---
export const importCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    // Logic handled via Service to ensure password hashing
                    await UserService.createUser({
                        full_name: row.full_name,
                        email: row.email,
                        password: row.password || 'ChangeMe123', // Default if missing
                        role: row.role || 'artist'
                    });
                }
                fs.unlinkSync(filePath);
                res.json({ message: `${results.length} users imported successfully` });
            } catch (err) {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                res.status(500).json({ error: "Import failed: " + err.message });
            }
        });
};

// Helper: Get Single User [Updated to full_name]
export const getById = async (req, res) => {
    try {
        const user = await query(
            'SELECT id, full_name, email, role, created_at FROM "user" WHERE id = $1',
            [req.params.id]
        );
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(user[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};