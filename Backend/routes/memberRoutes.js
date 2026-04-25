// backend/routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Create a new member
router.post('/add', async (req, res) => {
    try {
        const { gym_id, name, email, phone, plan } = req.body;

        // In a real app, gym_id comes from the logged-in user's token.
        // For now, we'll accept it from the body.
        
        const newMember = new Member({
            gym_id,
            name,
            email,
            phone,
            plan
        });

        await newMember.save();
        res.status(201).json({ success: true, member: newMember });
        
    } catch (error) {
        console.error("Error adding member:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Get all members for a specific gym
router.get('/:gym_id', async (req, res) => {
    try {
        const members = await Member.find({ gym_id: req.params.gym_id }).sort({ joinDate: -1 });
        res.status(200).json({ success: true, members });
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;