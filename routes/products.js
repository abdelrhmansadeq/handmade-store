const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// GET /api/products - جلب كل المنتجات (لأي حد)
router.get('/', getAllProducts);

// GET /api/products/:id - جلب منتج واحد (لأي حد)
router.get('/:id', getProductById);

// POST /api/products - إضافة منتج (أدمن بس)
router.post('/', protect, adminOnly, createProduct);

// PUT /api/products/:id - تعديل منتج (أدمن بس)
router.put('/:id', protect, adminOnly, updateProduct);

// DELETE /api/products/:id - حذف منتج (أدمن بس)
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;