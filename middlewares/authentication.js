const jwt = require("jsonwebtoken");
const { SEED } = require("../config/config");

// ===================================
// Verify Token
// ===================================
exports.verifyToken = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, SEED, (err, decoded) => {
    if (err)
      errorHandler(res, 401, "UserRoute: Incorrect Token", "Verify Token");
    req.user = decoded.user;
    next();
  });
};

// ===================================
// Success Handler
// ===================================
const successHandler = (res, status, data) => {
  res.status(status).json({
    ok: true,
    decoded: data
  });
};

// ===================================
// Error Handler
// ===================================
const errorHandler = (res, status, message, err) => {
  return res.status(status).json({
    ok: false,
    message,
    errors: err
  });
};
