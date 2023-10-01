const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key";

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
}

function verifyToken(token) {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
