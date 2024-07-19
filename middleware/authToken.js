const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Middleware to check if user has a valid token
const checkToken = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      error: true,
    });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
        error: true,
      });
    }

    // Store decoded user ID in request object
    req.userId = decoded.id;
    next();
  });
};

module.exports = checkToken;
