const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        let token;

        // 1. نشوف لو فيه Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Not authorized, no token'
            });
        }

        // 2. نتحقق من صحة الـ Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. نحط بيانات المستخدم في req
        req.user = decoded;

        // 4. نسمح للـ Request يكمّل
        next();

    } catch (error) {
        return res.status(401).json({
            status: 'ERROR',
            message: 'Not authorized, invalid token'
        });
    }
};

module.exports = { protect };