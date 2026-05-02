const jwt = require("jsonwebtoken");

// This middleware checks if the user is logged in by verifying their JWT token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists in the request header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. Please login first." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please login again." });
  }
};

module.exports = protect;
