const { query } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { first_name, last_name, email, password, phone, dob, gender, address, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await query(
            `INSERT INTO "user" (first_name, last_name, email, password, phone, dob, gender, "Address", role, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
            [first_name, last_name, email, hashedPassword, phone, dob, gender, address, role]
        );
        res.status(201).json({ message: "Admin registered successfully. Please login." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await query('SELECT * FROM "user" WHERE email = $1', [email]);
        const user = users[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role, name: user.first_name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};