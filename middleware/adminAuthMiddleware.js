const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware to check if user has a valid token and admin privileges
const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized: Token missing");
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has admin privileges
    if (decoded.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden: Admin access required");
    }

    // Store decoded user data in request object
    req.userData = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = adminAuthMiddleware;
