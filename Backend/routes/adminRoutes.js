// Get all members for a specific gym
router.get('/gyms/:gymId/members', async (req, res) => {
    try {
        const { gymId } = req.params;
        // We only want 'members', not 'trainers' or 'admin'
        const members = await pool.query(
            'SELECT * FROM Users WHERE gym_id = $1 AND role = $2 ORDER BY created_at DESC',
            [gymId, 'member']
        );
        res.status(200).json({ success: true, members: members.rows });
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});