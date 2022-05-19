const { body, validationResult } = require('express-validator');

const express = require('express');
const app = express();
const firstNameValidator = () => {
  return [body('firstName').exists()];
};

const lastNameValidator = () => {
  return [body('lastName').exists()];
};

const profilePictureValidator = () => {
  return [body('profilePicture').exists().isString()];
};

const walletAddressValidator = () => {
  return [body('walletAddress').exists()];
};
const fromValidator = () => {
  return [body('from').exists()];
};

const toValidator = () => {
  return [body('to').exists()];
};
const amountValidator = () => {
  return [body('amount').exists()];
};

const privateKeyValidator = () => {
  return [
    body('privateKey').not().isEmpty().withMessage('Enter AlphaNumeric Value'),
  ];
};

const enterJackpotValidator = () => {
  return [
    body('privateKey').not().isEmpty().withMessage('Enter AlphaNumeric Value'),
    body('entryfee')
      .isNumeric({ gt: 0 })
      .withMessage('Enter Numeric Value greater than zero to enter Jackpot'),
  ];
};

const validateCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};
module.exports = {
  body,
  validationResult,
  firstNameValidator,
  lastNameValidator,
  profilePictureValidator,
  walletAddressValidator,
  fromValidator,
  toValidator,
  amountValidator,
  enterJackpotValidator,
  privateKeyValidator,
  validateCheck,
};
