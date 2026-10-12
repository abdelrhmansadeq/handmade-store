const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// كل الـ routes محمية (لازم تسجيل دخول)
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:id', protect, updateCartQuantity);
router.delete('/:id', protect, removeFromCart);

module.exports = router;