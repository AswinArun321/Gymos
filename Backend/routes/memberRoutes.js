// backend/routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new member
router.post('/add', async (req, res) => {
    try {
        const { gym_id, name, email, phone, plan } = req.body;

        // 1. Give them a default password (e.g., "gymos123") so they can log in to their own app later
        const defaultPasswordHash = await require('bcryptjs').hash('gymos123', 10);

        // 2. Insert into Users table
        const insertQuery = `
            INSERT INTO Users (gym_id, name, email, phone, password_hash, role) 
            VALUES ($1, $2, $3, $4, $5, 'member') RETURNING user_id, name;
        `;
        
        const result = await pool.query(insertQuery, [gym_id, name, email, phone, defaultPasswordHash]);

        // (We would also link the chosen 'plan' to a user_subscriptions table later, 
        // but this gets the user into your system!)

        res.status(201).json({ success: true, member: result.rows[0] });
        
    } catch (error) {
        // Handle duplicate email errors specifically
        if (error.code === '23505') { 
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }
        console.error("Error adding member:", error);
        res.status(500).json({ error: 'Database error while saving member.' });
    }
});

// Get all members for a specific gym
router.get('/:gym_id', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT user_id, name, email, phone, join_date, is_active FROM Users WHERE gym_id = $1 AND role = 'member' ORDER BY join_date DESC",
            [req.params.gym_id]
        );
        res.status(200).json({ success: true, members: result.rows });
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;