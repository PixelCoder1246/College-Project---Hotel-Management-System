const { verifyToken } = require('../utils/jwt.util');
const { error } = require('../utils/response.util');
const prisma = require('../config/db');

const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.headers.authorization;
    }
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return error(res, 'No token provided. Please log in.', 401);
  }

  try {
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return error(res, 'User no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    return error(res, 'Invalid or expired token. Please log in again.', 401);
  }
};

module.exports = { authenticate };
