const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    req.userData = decoded;
  } catch (error) {
    return res.status(500).json({ message: 'Authorization Failed' });
  }
  next();
};
