import { query } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { full_name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // FIX: Wrap the table name user in double quotes "user"
        await query(
            `INSERT INTO "user" (full_name, email, password, role, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, NOW(), NOW())`,
            [full_name, email, hashedPassword, role]
        );

        res.status(201).json({ message: "Registered successfully." });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("REQ BODY:", email);


    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // ✅ FIX HERE
        const result = await query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );

        console.log("REQ Result:", result);
        const users = result;

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.full_name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            token,
            role: user.role,
            name: user.full_name
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            error: "Internal Server Error",
            details: err.message
        });
    }
};