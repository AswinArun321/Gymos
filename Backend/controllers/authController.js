const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize DB pool (we write the real DB code so it's ready when you create tables)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Generate JWT Token Helper
const generateToken = (userId, gymId, role) => {
    return jwt.sign({ userId, gymId, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token lasts for 30 days
    });
};

// @desc    Register a new user (Admin, Trainer, Member)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { gym_id, name, email, phone, password, role } = req.body;

    try {
        // 1. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Insert into database
        const newUserQuery = `
            INSERT INTO Users (gym_id, name, email, phone, password_hash, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id, gym_id, name, email, role;
        `;
        const result = await pool.query(newUserQuery, [gym_id, name, email, phone, hashedPassword, role]);
        const user = result.rows[0];

        // 3. Send response with token
        res.status(201).json({
            message: "User registered successfully",
            user: user,
            token: generateToken(user.user_id, user.gym_id, user.role)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const userQuery = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const user = userQuery.rows[0];

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Send response with token
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.user_id,
                name: user.name,
                role: user.role,
                gym_id: user.gym_id
            },
            token: generateToken(user.user_id, user.gym_id, user.role)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login" });
    }
};