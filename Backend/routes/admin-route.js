const express = require('express');
const adminController = require('../controllers/admin-controller');
const validator = require('./../middleware/validate.js');

const router = express.Router();

router.post(
  '/awardwinner',
  validator.privateKeyValidator(),
  adminController.awardWinner
);

module.exports = router;
