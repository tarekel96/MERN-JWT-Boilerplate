const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// bcrypt hashes the password before via Salt Rounds before storing it in the DB
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
// Requiring jwt module, used to protect API endpoints
// JSON Web Token is composed of the payload, secret, and signature
const jwt = require("jsonwebtoken");
/* Middleware that  authenticates callers using a JWT. 
If the token is valid, req.user (the decoded jwt) will be set with the 
JSON object decoded to be used by later middleware for authorization and access control */
const exjwt = require("express-jwt");
/* Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
Can enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware. */
// const cookieParser = require("cookie-parser");

/* Let the server know that we should expect and allow a header 
with the content-type of 'Authorization' */
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

// node server setup so can parse the req/res coming in & out of the server
// router.use(cookieParser());

/* set up an express jsonwebtoken middleware (simply required for ??????
express to properly utilize the token for requests) */

// You MUST instantiate this with the same secret that will be sent to the client */
// Define JWT SECRET here
const jwtMW = exjwt({
  secret: "secret"
});

// POST route where the users will signup
router.post("/signup", function(req, res) {
  // eslint-disable-next-line no-console
  console.log("Testing Database");
  // sending the password in the body of the POST request
  // make callback function a named function TODO TODO TODO
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      // json error message if failed to hash password
      return res.status(500).json({
        error: err
      });
      // adds a new user to DB TODO TODO TODO
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      // user is saved to the DB
      user
        .save()
        .then(function(result) {
          // eslint-disable-next-line no-console
          console.log(result);
          // 200 implies that the response contains the Payload representing the user
          res.status(200).json({
            success: "New user has been created"
          });
        })
        // eslint-disable-next-line
        .catch(error => {
          res.status(500).json({
            error: err
          });
        });
    }
  });
});

// POST route where the users will login
// make callback function a named function TODO TODO TODO
router.post("/login", function(req, res) {
  // eslint-disable-next-line no-console
  console.log("Inside the user.route login");
  // User Schema looks if email sent in the req.body exists in the db
  User.findOne({ email: req.body.email })
    // exec is used because did not pass a callback after findOne
    .exec()
    .then(function(user) {
      // if email is found, it compares req.body password to the hashed password from the DB
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) {
          // eslint-disable-next-line no-console
          console.log("Entered Password and Hash do not match!");
          res.status(401).json({
            sucess: false,
            token: null,
            err: "Entered Password and Hash do not match!"
          });
        }

        /* if passwords match, then the user will get success message - testing purposes
        // if (result) {
        //   return res.status(200).json({
        //     success: "Welcome to the JWT Auth"
        //   });
        } */

        /* if the email & pw match a user in the DB, 
        a token will be sent to the user via response */
        if (result) {
          // Represents the decoded JSON Web Token ?????
          const JWTToken = jwt.sign(
            // Payload of the JWT
            {
              email: user.email,
              _id: user._id
            },
            // Secret of the JWT
            "secret",
            {
              expiresIn: "2h"
            }
          );
          // eslint-disable-next-line
          // console.log(JWTToken);
          // Signature ?????
          res.json({
            sucess: true,
            err: null,
            token: JWTToken
          });
        }
        // if req.body password does not match the hashed password
        // return res.status(401).json({
        //   failed: "Unauthorized Access"
        // });
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

// eslint-disable-next-line
router.get("/", jwtMW /* Using the express jwt MW here */, (req, res) => {
  /* ??? */
  // eslint-disable-next-line no-console
  console.log("Web Token Checked.");
  // res.send("You are authenticated"); Sending some response when authenticated
});

module.exports = router;
