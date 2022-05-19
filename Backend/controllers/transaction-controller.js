const HttpError = require('../util/http-error');
const Transaction = require('../models/transaction-model.js');
const validator = require('../middleware/validate');
// API to get all transactions
const getTransactions = async (req, res, next) => {
  let transactions;
  try {
    transactions = await Transaction.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching Transactions failed, please try again later.' + err,
      500
    );
    return next(error);
  }
  res.json({ Transactions: transactions });
};
//API to get transactions by Sender Address
const getTransactionByFromAddress = async (req, res, next) => {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { from } = req.body;
  let existingTransaction;
  try {
    existingTransaction = await Transaction.findOne({ from: from });
  } catch (err) {
    const error = new HttpError('Please try again later.' + err, 500);
    return next(error);
  }

  if (!existingTransaction) {
    const error = new HttpError('Invalid address, Not found.', 403);
    return next(error);
  }
  res.json(existingTransaction);
};
//API to get transactions by Receiver Address
const getTransactionByToAddress = async (req, res, next) => {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { to } = req.body;
  let existingTransaction;
  try {
    existingTransaction = await Transaction.findOne({ to: to });
  } catch (err) {
    const error = new HttpError('Please try again later.' + err, 500);
    return next(error);
  }

  if (!existingTransaction) {
    const error = new HttpError('Invalid address, Not found.', 403);
    return next(error);
  }
  res.json(existingTransaction);
};
// API to transfer Tokens
const transfer = async (req, res, next) => {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { from, to, amount } = req.body;

  const createdTransaction = new Transaction({
    from,
    to,
    amount,
  });

  try {
    await createdTransaction.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed while saving, please try again later' + err,
      500
    );
    return next(error);
  }
  console.log(createdTransaction);
  res.status(201).json(createdTransaction);
};

module.exports = {
  getTransactions,
  getTransactionByFromAddress,
  getTransactionByToAddress,
  transfer,
};
