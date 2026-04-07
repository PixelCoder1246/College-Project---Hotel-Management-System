const { verifyToken } = require('../utils/jwt.util');
const { error } = require('../utils/response.util');
const prisma = require('../config/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'No token provided. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];

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
  } catch {
    return error(res, 'Invalid or expired token. Please log in again.', 401);
  }
};

module.exports = { authenticate };
