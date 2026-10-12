const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// دالة تسجيل مستخدم جديد
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // التحقق من البيانات
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Please provide name, email, and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Password must be at least 6 characters'
            });
        }

        // التأكد إن الإيميل مش مستخدم
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Email already exists'
            });
        }

        // تشفير الباسورد
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // إضافة المستخدم للداتابيز
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
            [name, email, passwordHash, 'customer']
        );

        // عمل Token
        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            status: 'OK',
            message: 'User registered successfully',
            data: { user: newUser.rows[0], token }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// دالة تسجيل الدخول
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Please provide email and password'
            });
        }

        // البحث عن المستخدم
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Invalid credentials'
            });
        }

        // التأكد من الباسورد
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!isMatch) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Invalid credentials'
            });
        }

        // عمل Token
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // إزالة الباسورد من الرد
        const { password_hash, ...userData } = user.rows[0];

        res.json({
            status: 'OK',
            message: 'Logged in successfully',
            data: { user: userData, token }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// دالة جلب بيانات المستخدم الحالي
const getMe = async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'User not found'
            });
        }

        res.json({
            status: 'OK',
            data: { user: user.rows[0] }
        });

    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

module.exports = { register, login, getMe };