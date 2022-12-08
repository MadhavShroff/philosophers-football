const mongoose = require("mongoose");

// Specifying the types of data that will be stored in the database.
// This is one line of defence against SQL injection attacks
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String
  })
);

module.exports = User;