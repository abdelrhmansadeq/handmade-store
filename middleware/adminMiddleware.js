const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({
        status: 'ERROR',
        message: 'Access denied. Admin only.'
    });
};

module.exports = { adminOnly };