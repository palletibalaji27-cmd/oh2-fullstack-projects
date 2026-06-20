const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_dev_key_123456');

      // Get user from the token, exclude password
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

module.exports = { protect };
