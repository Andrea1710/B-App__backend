const express = require("express");
const mongoose = require("mongoose");

// Initialize Variables
const app = express();

// Database Connection
mongoose.connection.openUri("mongodb://localhost:27017/BappuDB", (err, res) => {
  if (err) throw err;
  console.log("Database: \x1b[32m%s\x1b[0m", "connected");
});

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    message: "Request successfull"
  });
});

// Listening
app.listen(3000, () => console.log("Server: \x1b[32m%s\x1b[0m", "connected"));
