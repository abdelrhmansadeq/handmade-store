const pool = require('../db');

// 1. إضافة منتج للسلة
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const userId = req.user.id;

        if (!product_id) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'product_id is required'
            });
        }

        const qty = quantity || 1;

        const result = await pool.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, product_id)
             DO UPDATE SET quantity = cart_items.quantity + $3
             RETURNING *`,
            [userId, product_id, qty]
        );

        res.status(201).json({
            status: 'OK',
            message: 'Added to cart',
            data: { cartItem: result.rows[0] }
        });

    } catch (error) {
        console.error('AddToCart error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 2. عرض السلة
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT ci.id, ci.quantity, ci.product_id,
                    p.name, p.price, p.image_url, p.stock
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = $1
             ORDER BY ci.created_at DESC`,
            [userId]
        );

        const total = result.rows.reduce(
            (sum, item) => sum + (parseFloat(item.price) * item.quantity),
            0
        );

        res.json({
            status: 'OK',
            results: result.rows.length,
            total: total.toFixed(2),
            data: { cart: result.rows }
        });

    } catch (error) {
        console.error('GetCart error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 3. حذف منتج من السلة
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Cart item not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error('RemoveFromCart error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 4. تعديل كمية منتج في السلة
const updateCartQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Quantity must be at least 1'
            });
        }

        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Cart item not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Cart updated',
            data: { cartItem: result.rows[0] }
        });

    } catch (error) {
        console.error('UpdateCartQuantity error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
};