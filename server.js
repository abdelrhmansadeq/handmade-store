// ================================//قلب الباك اند
// 1. Imports
// ================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ================================
// 2. App Setup
// ================================
const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// 3. Middleware
// ================================
app.use(cors());
app.use(express.json());

// ================================
// 4. Routes
// ================================
// Import Routes
const authRoutes = require('./routes/auth');

// Mount Routes
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Handmade Store API is running 🚀',
        timestamp: new Date().toISOString()
    });
});
const pool = require('./db');

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        res.json({
            status: 'OK',
            message: 'Database connected successfully',
            userCount: result.rows[0].count
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// ================================
// 5. Start Server
// ================================
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
});