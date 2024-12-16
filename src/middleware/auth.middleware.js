import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user data (id, name, email) to the request object
    req.user = {
      id: decoded.user.id,
      name: decoded.user.name,
      email: decoded.user.email,
    };

    next();
  } catch (err) {
    console.log('Invalid token:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
