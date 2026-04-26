const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db'); 

// REGISTER (Creates a Gym AND an Admin User)
router.post('/register', async (req, res) => {
    const client = await pool.connect();
    try {
        const { gym_name, owner_name, email, phone, password } = req.body;
        await client.query('BEGIN');

        const gymInsertQuery = `
            INSERT INTO Gyms (gym_name, owner_name, email, phone) 
            VALUES ($1, $2, $3, $4) RETURNING gym_id;
        `;
        const gymResult = await client.query(gymInsertQuery, [gym_name, owner_name, email, phone]);
        const newGymId = gymResult.rows[0].gym_id;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userInsertQuery = `
            INSERT INTO Users (gym_id, name, email, phone, password_hash, role) 
            VALUES ($1, $2, $3, $4, $5, 'admin') RETURNING user_id, name, role;
        `;
        await client.query(userInsertQuery, [newGymId, owner_name, email, phone, hashedPassword]);

        await client.query('COMMIT'); 
        res.status(201).json({ success: true, message: "Workspace created!" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Register Error:", error);
        res.status(500).json({ error: 'Failed to register gym.' });
    } finally {
        client.release();
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const userQuery = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = userQuery.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ 
            success: true, 
            role: user.role, 
            user: { id: user.user_id, name: user.name, gym_id: user.gym_id } 
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;