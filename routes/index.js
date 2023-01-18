var express = require('express');
const jwt = require("jsonwebtoken");
var {
  USERS,
  SECRET_KEY
} = require('../public/constant');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/authenticate', async function (req, res, next) {

  let {
    email,
    password
  } = req.body;
  let existingUser;
  let userData = USERS;
  userData.forEach((user, index) => {
    if (user.email == email && user.password == password) {
      console.log("user " + index + " :: " + JSON.stringify(user));
      existingUser = user;
    }
  });

  if (existingUser) {
    let token;
    try {
      //Creating jwt token
      token = jwt.sign({
          user: existingUser
        },
        SECRET_KEY, {
          expiresIn: "1h"
        }
      );
    } catch (err) {
      console.log(err);
      const error = new Error("Error! Something went wrong.");
      return next(error);
    }
    res.status(200).json({
      msg: 'Login Success',
      token: token,
      success: true
    });
  } else {
    res.status(401).json({
      msg: 'Login Error',
      token: null,
      success: false
    });
  }
});

router.get('/profile', function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res.status(200).json({
      success: false,
      message: "Error! Token was not provided."
    });
  }
  //Decoding the token
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    console.log("decodedToken::" + JSON.stringify(decodedToken));
    res.status(200).json({
      success: true,
      data: {
        user: decodedToken.user
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }

});

module.exports = router;