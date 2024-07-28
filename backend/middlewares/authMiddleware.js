const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const expressAsyncHandler = require('express-async-handler');

const checkToken = expressAsyncHandler(async (req, res, next) => {
    let token = req.cookies.token; // Check for token in cookies

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

module.exports = { checkToken };
