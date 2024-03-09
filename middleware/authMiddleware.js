const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  console.log("middleware working");
  console.log("da token:", token);

  jwt.verify(token, "oogabooga", (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Forbidden - Invalid token" });
    }

    // Assuming the user ID is stored under 'userId' in the JWT payload
    req.user = { userId: decoded.userId }; // Modify this based on the actual key in your JWT payload

    next();
  });
};

module.exports = { protect };
