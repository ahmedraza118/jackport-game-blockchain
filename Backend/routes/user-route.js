const express = require('express');
const userController = require('../controllers/user-controller');
const validator = require('./../middleware/validate.js');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('Welcome to User Routes! ');
  res.send('In User Routes!!!!');
});

router.post(
  '/enter',
  validator.enterJackpotValidator(),
  userController.enterUser
);

router.post(
  '/register',
  //validator.enterJackpotValidator(),
  userController.register,
  (req, res) => {
    console.log('Welcome to User-Register Routes! ');
    res.send('In User-Register Routes!!!!');
  }
);

router.get('/get-all-users', userController.getUsers, (req, res) => {
  console.log('Welcome to User Routes! ');
  res.send('In User Routes!!!!');
});

// router.post(
//   "/updatename",
//   validator.updateNameCheck(),
//   userController.updateName
// );

// router.post(
//   "/updatepassword",
//   validator.updatePasswordCheck(),
//   userController.updatePassword
// );

// router.post(
//   "/updateemail",
//   validator.updateemailCheck(),
//   userController.updateemail
// );

// router.post("/login", validator.checklogin(), userController.logIn);

module.exports = router;
