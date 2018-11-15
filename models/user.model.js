// mongoose is the ORM for MongoDB and NodeJS
// it lets us use JavaScript to interact with the database
const mongoose = require("mongoose");

// Defined user schema here
const user = mongoose.Schema({
  // id, email, and password are the properties for this document
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", user);
