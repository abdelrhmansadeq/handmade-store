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
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Handmade Store API is running 🚀',
        timestamp: new Date().toISOString()
    });
});

// ================================
// 5. Start Server
// ================================
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
});