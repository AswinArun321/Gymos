// backend/routes/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Get high-level platform stats (For Overview Dashboard)
router.get('/platform-stats', async (req, res) => {
    try {
        const gymCount = await pool.query('SELECT COUNT(*) FROM Gyms');
        const memberCount = await pool.query("SELECT COUNT(*) FROM Users WHERE role = 'member'");
        const recentGyms = await pool.query(`
            SELECT gym_id, gym_name, owner_name, created_at, subscription_plan 
            FROM Gyms 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        res.status(200).json({
            success: true,
            stats: {
                totalGyms: parseInt(gymCount.rows[0].count),
                totalMembers: parseInt(memberCount.rows[0].count),
                recentGyms: recentGyms.rows
            }
        });
    } catch (error) {
        console.error("Error fetching platform stats:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ==========================================
// NEW ROUTES FOR THE SIDEBAR TABS
// ==========================================

// 2. Get ALL Gyms (For "All Gyms" Tab)
router.get('/gyms', async (req, res) => {
    try {
        const gyms = await pool.query('SELECT * FROM Gyms ORDER BY created_at DESC');
        res.status(200).json({ success: true, gyms: gyms.rows });
    } catch (error) {
        console.error("Error fetching all gyms:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// 3. Get ALL Users across the entire platform (For "Platform Users" Tab)
router.get('/users', async (req, res) => {
    try {
        const users = await pool.query(`
            SELECT u.user_id, u.name, u.email, u.role, u.is_active, u.created_at, g.gym_name 
            FROM Users u 
            LEFT JOIN Gyms g ON u.gym_id = g.gym_id 
            ORDER BY u.created_at DESC
        `);
        res.status(200).json({ success: true, users: users.rows });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ==========================================
// EXISTING MANAGEMENT ROUTES
// ==========================================

// Update a gym's status (Active / Suspended)
router.put('/gyms/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        
        await pool.query('UPDATE Gyms SET status = $1 WHERE gym_id = $2', [status, id]);
        
        const isActive = status === 'Active';
        await pool.query('UPDATE Users SET is_active = $1 WHERE gym_id = $2', [isActive, id]);

        res.status(200).json({ success: true, message: `Gym status updated to ${status}` });
    } catch (error) {
        console.error("Error updating gym status:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Delete a gym permanently
router.delete('/gyms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Gyms WHERE gym_id = $1', [id]);
        
        res.status(200).json({ success: true, message: 'Gym deleted successfully' });
    } catch (error) {
        console.error("Error deleting gym:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;