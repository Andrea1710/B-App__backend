const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middlewares/authentication");
const User = require("../models/User");

// ===================================
// Get all Users
// ===================================
app.get("/", (req, res, next) => {
  User.find({}, (err, users) => {
    if (err)
      errorHandler(res, 500, "UserRoute: Error in GET Request", "Find Users");
    successHandler(res, 200, users);
  });
});

// ===================================
// Create new User
// ===================================
app.post("/", verifyToken, (req, res) => {
  const { name, email, password, img, role } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    password: encryptedPassword,
    img,
    role
  });

  user.save((err, savedUser) => {
    if (err) errorHandler(res, 400, "UserRoute: Error in POST Request", err);
    successHandler(res, 201, savedUser, req.user);
  });
});

// ===================================
// Update a User
// ===================================
app.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  User.findById(id, (err, user) => {
    if (err)
      return errorHandler(
        500,
        "UserRoute: Error in PUT Request",
        "Find User By Id"
      );
    if (!user)
      return errorHandler(400, "UserRoute: Error in PUT Request", {
        message: `User with ID ${id} doesn't exist`
      });

    user.name = name;
    user.email = email;
    user.role = role;

    user.save((err, savedUser) => {
      if (err)
        errorHandler(
          res,
          400,
          "UserRoute: Error in PUT Request - Save User to Database",
          err
        );
      savedUser.password = null;
      successHandler(res, 200, savedUser);
    });
  });
});

// ===================================
// Delete a User
// ===================================
app.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id, (err, deletedUser) => {
    if (err)
      return errorHandler(res, 500, "UserRoute: Error in DELETE Request", {
        message: "Delete a User by ID"
      });
    if (!deletedUser)
      return errorHandler(res, 400, "UserRoute: Error in DELETE Request", {
        message: `User with ID ${id} doesn't exist`
      });
    successHandler(res, 200, deletedUser);
  });
});

// ===================================
// Success Handler
// ===================================
const successHandler = (res, status, data, args = null) => {
  res.status(status).json({
    ok: true,
    user: data,
    userToken: args
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
