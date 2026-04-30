const express = require('express');
const router = express.Router();
const pool = require('../db'); 
const bcrypt = require('bcryptjs');

// ==========================================
// 1. DASHBOARD OVERVIEW ROUTES
// ==========================================

// Get Dashboard Stats
router.get('/gyms/:gymId/stats', async (req, res) => {
    try {
        const { gymId } = req.params;

        const membersCount = await pool.query(
            "SELECT COUNT(*) FROM Users WHERE gym_id = $1 AND role = 'member'",
            [gymId]
        );

        const trainersCount = await pool.query(
            "SELECT COUNT(*) FROM Users WHERE gym_id = $1 AND role = 'trainer'",
            [gymId]
        );

        res.status(200).json({
            success: true,
            stats: {
                totalMembers: parseInt(membersCount.rows[0].count),
                totalTrainers: parseInt(trainersCount.rows[0].count),
                monthlyRevenue: 45200, 
                expiringSoon: 12
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get Recent Registrations
router.get('/gyms/:gymId/recent-registrations', async (req, res) => {
    try {
        const { gymId } = req.params;
        const recent = await pool.query(
            // FIXED: Using join_date
            "SELECT user_id, name, join_date FROM Users WHERE gym_id = $1 AND role = 'member' ORDER BY join_date DESC LIMIT 5",
            [gymId]
        );
        res.status(200).json({ success: true, recent: recent.rows });
    } catch (error) {
        console.error("Error fetching recent registrations:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ==========================================
// 2. MEMBERS ROUTES
// ==========================================

// Get all members
router.get('/gyms/:gymId/members', async (req, res) => {
    try {
        const { gymId } = req.params;
        const members = await pool.query(
            // FIXED: Changed created_at to join_date
            "SELECT user_id, name, email, phone, join_date FROM Users WHERE gym_id = $1 AND role = 'member' ORDER BY join_date DESC",
            [gymId]
        );
        res.status(200).json({ success: true, members: members.rows });
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Add a new member
router.post('/gyms/:gymId/members', async (req, res) => {
    try {
        const { gymId } = req.params;
        const { name, email, phone, password } = req.body;

        const tempPassword = password || 'GymOS123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);
        
        const newUser = await pool.query(
            'INSERT INTO Users (gym_id, name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, email',
            [gymId, name, email, phone, hashedPassword, 'member']
        );
        
        res.status(201).json({ success: true, user: newUser.rows[0] });
    } catch (error) {
        console.error("Error adding member:", error.message);
        res.status(500).json({ error: error.detail || 'Server Error' });
    }
});

// ==========================================
// 3. TRAINERS ROUTES
// ==========================================

// Get all trainers
router.get('/gyms/:gymId/trainers', async (req, res) => {
    try {
        const { gymId } = req.params;
        const trainers = await pool.query(
            // FIXED: Changed created_at to join_date
            "SELECT user_id, name, email, phone, join_date FROM Users WHERE gym_id = $1 AND role = 'trainer' ORDER BY join_date DESC",
            [gymId]
        );
        res.status(200).json({ success: true, trainers: trainers.rows });
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Add a new trainer
router.post('/gyms/:gymId/trainers', async (req, res) => {
    try {
        const { gymId } = req.params;
        const { name, email, phone, password } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTrainer = await pool.query(
            'INSERT INTO Users (gym_id, name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, email',
            [gymId, name, email, phone, hashedPassword, 'trainer']
        );
        res.status(201).json({ success: true, user: newTrainer.rows[0] });
    } catch (error) {
        console.error("Error adding trainer:", error.message);
        res.status(500).json({ error: error.detail || 'Server Error' });
    }
});
// ==========================================
// 4. EDIT & DELETE ROUTES (MEMBERS & TRAINERS)
// ==========================================

// Update any user (Member or Trainer)
router.put('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, phone } = req.body;

        const updatedUser = await pool.query(
            "UPDATE Users SET name = $1, email = $2, phone = $3 WHERE user_id = $4 RETURNING *",
            [name, email, phone, userId]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ success: true, user: updatedUser.rows[0] });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// Delete any user (Member or Trainer)
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const deletedUser = await pool.query(
            "DELETE FROM Users WHERE user_id = $1 RETURNING name",
            [userId]
        );

        if (deletedUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: `User ${deletedUser.rows[0].name} deleted successfully` 
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;