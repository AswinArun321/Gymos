const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const app = express();
const memberRoutes = require('./routes/memberRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
// Middleware
app.use(cors());
app.use(express.json()); // Allows Express to parse incoming JSON payloads
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/superadmin', superAdminRoutes);
// PostgreSQL Connection Pool
// Concept: Connection Pooling prevents the server from opening and closing a new 
// database connection for every single HTTP request, which would severely degrade performance.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the database connection
pool.connect()
    .then(() => console.log('Connected to the GymOS PostgreSQL database successfully!'))
    .catch((err) => console.error('❌ Database connection error:', err.stack));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'GymOS Backend is running securely.' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});