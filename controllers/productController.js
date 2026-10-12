const pool = require('../db');

// 1. جلب كل المنتجات (مع فلترة اختيارية)
const getAllProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;

        let query = `
            SELECT p.*, c.name AS category_name, u.name AS vendor_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.vendor_id = u.id
            WHERE 1=1
        `;
        const values = [];
        let counter = 1;

        if (category) {
            query += ` AND p.category_id = $${counter}`;
            values.push(category);
            counter++;
        }

        if (search) {
            query += ` AND (p.name ILIKE $${counter} OR p.description ILIKE $${counter})`;
            values.push(`%${search}%`);
            counter++;
        }

        if (minPrice) {
            query += ` AND p.price >= $${counter}`;
            values.push(minPrice);
            counter++;
        }

        if (maxPrice) {
            query += ` AND p.price <= $${counter}`;
            values.push(maxPrice);
            counter++;
        }

        query += ' ORDER BY p.created_at DESC';

        const result = await pool.query(query, values);

        res.json({
            status: 'OK',
            results: result.rows.length,
            data: { products: result.rows }
        });

    } catch (error) {
        console.error('GetAllProducts error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 2. جلب منتج واحد
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT p.*, c.name AS category_name, u.name AS vendor_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             LEFT JOIN users u ON p.vendor_id = u.id
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Product not found'
            });
        }

        res.json({
            status: 'OK',
            data: { product: result.rows[0] }
        });

    } catch (error) {
        console.error('GetProductById error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 3. إضافة منتج جديد (أدمن بس)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image_url, category_id } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Name and price are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO products (name, description, price, stock, image_url, category_id, vendor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [name, description, price, stock || 0, image_url, category_id, req.user.id]
        );

        res.status(201).json({
            status: 'OK',
            message: 'Product created successfully',
            data: { product: result.rows[0] }
        });

    } catch (error) {
        console.error('CreateProduct error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 4. تعديل منتج (أدمن بس)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url, category_id } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET name = COALESCE($1, name),
                 description = COALESCE($2, description),
                 price = COALESCE($3, price),
                 stock = COALESCE($4, stock),
                 image_url = COALESCE($5, image_url),
                 category_id = COALESCE($6, category_id)
             WHERE id = $7
             RETURNING *`,
            [name, description, price, stock, image_url, category_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Product not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Product updated successfully',
            data: { product: result.rows[0] }
        });

    } catch (error) {
        console.error('UpdateProduct error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 5. حذف منتج (أدمن بس)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Product not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('DeleteProduct error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};