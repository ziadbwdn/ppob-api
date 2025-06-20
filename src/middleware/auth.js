const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak tidak valid atau kadaluarsa',
        data: null
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, profile_image, balance FROM users WHERE email = ?',
      [decoded.email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak tidak valid atau kadaluarsa',
        data: null
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak tidak valid atau kadaluarsa',
        data: null
      });
    }
    
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluarsa',
      data: null
    });
  }
};

module.exports = { authenticateToken };