// db.js
const mongoose = require('mongoose');

const mongoURL = "mongodb://127.0.0.1:27017/hotels";   // use 127.0.0.1 not "localhost"

mongoose.connect(mongoURL)
  .then(() => console.log("Connected to MongoDB server"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose.connection;