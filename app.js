const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Initialize Variables
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router Imports
const appRoutes = require("./routes/app");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");

// Database Connection
mongoose.connection.openUri("mongodb://localhost:27017/BappuDB", (err, res) => {
  if (err) throw err;
  console.log("Database: \x1b[32m%s\x1b[0m", "connected");
});

// Routes
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/", appRoutes);

// Listening
app.listen(3000, () => console.log("Server: \x1b[32m%s\x1b[0m", "connected"));
