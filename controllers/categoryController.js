const pool = require('../db');

const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        res.json({
            status: 'OK',
            results: result.rows.length,
            data: { categories: result.rows }
        });
    } catch (error) {
        console.error('GetAllCategories error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Category name is required'
            });
        }
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json({
            status: 'OK',
            message: 'Category created successfully',
            data: { category: result.rows[0] }
        });
    } catch (error) {
        console.error('CreateCategory error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

module.exports = { getAllCategories, createCategory };