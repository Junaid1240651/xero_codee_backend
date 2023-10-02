const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; // Change this to your actual secret key

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Use JWT_SECRET here
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

module.exports = { generateToken, verifyToken };
