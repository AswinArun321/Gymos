const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Verify Token Middleware
exports.protect = (req, res, next) => {
    let token;

    // Check if authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user data from the token payload to the request object
            req.user = decoded; 
            
            next(); // Move to the next function/controller
        } catch (error) {
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

// 2. Role Authorization Middleware
// Pass an array of allowed roles, e.g., authorizeRoles('admin', 'trainer')
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Role (${req.user ? req.user.role : 'none'}) is not allowed to access this resource` 
            });
        }
        next();
    };
};