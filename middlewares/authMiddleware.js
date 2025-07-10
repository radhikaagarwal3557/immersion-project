// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Get token after "Bearer"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.teacher = decoded; // teacher id will be on decoded.id
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
