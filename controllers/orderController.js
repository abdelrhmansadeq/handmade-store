const pool = require('../db');

// 1. إنشاء طلب جديد (Checkout)
const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        const { address, phone, notes } = req.body;
        const userId = req.user.id;

        if (!address || !phone) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Address and phone are required'
            });
        }

        await client.query('BEGIN');

        // جلب سلة المستخدم
        const cartResult = await client.query(
            `SELECT ci.product_id, ci.quantity, p.price, p.stock, p.name
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = $1`,
            [userId]
        );

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                status: 'ERROR',
                message: 'Cart is empty'
            });
        }

        // التأكد من المخزون
        for (const item of cartResult.rows) {
            if (item.quantity > item.stock) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    status: 'ERROR',
                    message: `Not enough stock for ${item.name}`
                });
            }
        }

        // حساب الإجمالي
        const total = cartResult.rows.reduce(
            (sum, item) => sum + (parseFloat(item.price) * item.quantity),
            0
        );

        // إنشاء الطلب
        const orderResult = await client.query(
            `INSERT INTO orders (customer_id, total_price, address, phone, notes, status)
             VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
            [userId, total.toFixed(2), address, phone, notes || null]
        );
        const orderId = orderResult.rows[0].id;

        // إضافة عناصر الطلب + خصم المخزون
        for (const item of cartResult.rows) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.product_id, item.quantity, item.price]
            );

            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        // تفريغ السلة
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        await client.query('COMMIT');

        res.status(201).json({
            status: 'OK',
            message: 'Order created successfully',
            data: { order: orderResult.rows[0] }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('CreateOrder error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    } finally {
        client.release();
    }
};

// 2. عرض طلبات المستخدم
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const ordersResult = await pool.query(
            'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        const orders = [];
        for (const order of ordersResult.rows) {
            const itemsResult = await pool.query(
                `SELECT oi.*, p.name, p.image_url
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = $1`,
                [order.id]
            );
            orders.push({ ...order, items: itemsResult.rows });
        }

        res.json({
            status: 'OK',
            results: orders.length,
            data: { orders }
        });

    } catch (error) {
        console.error('GetMyOrders error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 3. عرض كل الطلبات (أدمن)
const getAllOrders = async (req, res) => {
    try {
        const ordersResult = await pool.query(
            `SELECT o.*, u.name AS customer_name, u.email AS customer_email
             FROM orders o
             JOIN users u ON o.customer_id = u.id
             ORDER BY o.created_at DESC`
        );

        const orders = [];
        for (const order of ordersResult.rows) {
            const itemsResult = await pool.query(
                `SELECT oi.*, p.name
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = $1`,
                [order.id]
            );
            orders.push({ ...order, items: itemsResult.rows });
        }

        res.json({
            status: 'OK',
            results: orders.length,
            data: { orders }
        });

    } catch (error) {
        console.error('GetAllOrders error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// 4. تعديل حالة الطلب (أدمن)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                status: 'ERROR',
                message: `Status must be one of: ${allowed.join(', ')}`
            });
        }

        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Order not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Order status updated',
            data: { order: result.rows[0] }
        });

    } catch (error) {
        console.error('UpdateOrderStatus error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Something went wrong',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};