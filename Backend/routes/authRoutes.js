const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a Protected Route (Just for testing the middleware)
// Only Admins can hit this route
router.get('/admin-data', protect, authorizeRoles('admin'), (req, res) => {
    res.json({ message: "Welcome Admin! Here is the top secret gym revenue data." });
});

module.exports = router;