// Require packages
const express = require("express");
const app = express();
// Parses incoming request bodies in a middleware before your handlers,
// available under the req.body property.
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//require user objects from routes
const user = require("./routes/user.route");
// define our PORT where express will run on
const PORT = process.env.PORT || 3001;

app.use(function(req, res, next) {
  // eslint-disable-next-line
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//testing express server via Postman
app.get("/checking", function(req, res) {
  res.json({
    Test: "Testing testing"
  });
});

// creates a connection to MongoDB
//local host is host name and jwtauth is the database name
mongoose.connect(
  "mongodb://localhost:27017/jwtauth",
  { useNewUrlParser: true }
);

// enables bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// implements the user.route.js file into server
app.use("/user", user);

// PORT where our server is listening on
// app.listen(PORT, function() {
//   console.log("Server is running on Port", PORT);
// });

// Start the API server (express server)
app.listen(PORT, function() {
  // eslint-disable-next-line no-console
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
