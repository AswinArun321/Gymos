// backend/routes/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get high-level platform stats
router.get('/platform-stats', async (req, res) => {
    try {
        // 1. Get total active gyms
        const gymCount = await pool.query('SELECT COUNT(*) FROM Gyms');
        
        // 2. Get total end users (members) across all gyms
        const memberCount = await pool.query("SELECT COUNT(*) FROM Users WHERE role = 'member'");
        
        // 3. Get the 5 most recent gym registrations for the table
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
// Update a gym's status (Active / Suspended)
router.put('/gyms/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        
        await pool.query('UPDATE Gyms SET status = $1 WHERE gym_id = $2', [status, id]);
        
        // If suspending the gym, suspend all its users too
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
        // Because we set ON DELETE CASCADE in your SQL tables, 
        // deleting the gym will automatically delete all its members and plans!
        await pool.query('DELETE FROM Gyms WHERE gym_id = $1', [id]);
        
        res.status(200).json({ success: true, message: 'Gym deleted successfully' });
    } catch (error) {
        console.error("Error deleting gym:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});
module.exports = router;