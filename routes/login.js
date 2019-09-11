const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SEED } = require("../config/config");

// ===================================
// Login
// ===================================
app.post("/", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, userDB) => {
    if (err)
      errorHandler(
        res,
        500,
        "LoginRoute: Error in POST Request",
        "Error in finding User"
      );
    if (!userDB)
      errorHandler(
        res,
        400,
        "LoginRoute: Error in POST Request",
        "Incorrect Credentials"
      );
    if (!bcrypt.compareSync(password, userDB.password))
      errorHandler(
        res,
        400,
        "LoginRoute: Error in POST Request",
        "Incorrect Credentials"
      );
    // Create Token
    const token = jwt.sign({ user: userDB }, SEED, {
      expiresIn: 14400
    });
    userDB.password = null;
    successHandler(res, 200, userDB, userDB._id, token);
  });
});

// ===================================
// Success Handler
// ===================================
const successHandler = (res, status, data, id = null, token = null) => {
  res.status(status).json({
    ok: true,
    user: data,
    id: id,
    token: token
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

module.exports = app;
