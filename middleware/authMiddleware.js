import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    console.error("❌ No token provided");
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.error("❌ Invalid token format");
    return res.status(400).json({ error: 'Invalid token format, expected: Bearer <token>' });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ✅ Attach userId to req.user so other routes can use req.user.userId
    req.user = { userId: decoded.userId };
    console.log("✅ Authenticated user:", req.user);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
