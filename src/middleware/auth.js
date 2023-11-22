const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader)
    return res.status(401).json({ msg: 'No token, authorization denied' });
  
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ msg: 'Token is not valid' });
    req.userId = decoded.user.id;
    next();
  });
};

module.exports = verifyToken;
