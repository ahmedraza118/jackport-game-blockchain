const User = require('../models/user-model');
const validator = require('./../middleware/validate.js');
const { ethers } = require('ethers');
const HttpError = require('./../util/http-error');

const INFURA_ID = '7e5ac588b550481e8df3f4b6d8f4da6d';
const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${INFURA_ID}`
);

const ERC20_ABI = [
  'function enter() public payable',
  'function pickWinner() public returns(address)',
  'function awardwinner() public',
];

const address = '0xB216a92466A77886174153E9D930b722d6048EdF';

//API to get users
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.' + err,
      500
    );
    return next(error);
  }
  res.json({ users: users });
};

const enterUser = async (req, res, next) => {
  if (validator.validateCheck(req, res)) {
    return;
  }

  const { privateKey, entryfee } = req.body;

  let contract;
  let wallet;

  try {
    contract = new ethers.Contract(address, ERC20_ABI, provider);
    wallet = new ethers.Wallet(privateKey, provider);
  } catch (err) {
    const error = new HttpError(
      'Failed to connect to wallet, please try again later.' + err,
      500
    );
    return next(error);
  }
  let tx;
  try {
    const contractWithWallet = contract.connect(wallet);

    const options = { value: ethers.utils.parseEther(entryfee) };

    tx = await contractWithWallet.enter(options);

    await tx.wait();
  } catch (err) {
    const error = new HttpError(
      'Failed to enter jackpot, please try again later.' + err,
      500
    );
    return next(error);
  }

  res.status(200).send(tx);
};

// API to get user by wallet address

const getUsersByWalletAddress = async (req, res, next) => {
  const errors = validator.validateCheck(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { walletAddress } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ walletAddress: walletAddress });
  } catch (err) {
    const error = new HttpError('Please try again later.' + err, 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError('Invalid Wallet Address, Not found.', 403);
    return next(error);
  }
  res.json(existingUser);
};
// API to register user
const register = async (req, res, next) => {
  // const errors = validator.validationResult(req);
  // // if (!errors.isEmpty()) {
  // //   return next(
  // //     new HttpError('Invalid inputs passed, please check your data.', 422)
  // //   );
  // // }
  console.log('register validation done!');

  const { firstName, lastName, profilePicture, walletAddress, password } =
    req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ walletAddress: walletAddress });
  } catch (err) {
    const error = new HttpError(
      'Registering up failed, please try again later.' + err,
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User with same wallet address exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    firstName,
    lastName,
    profilePicture,
    walletAddress,
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed while saving, please try again later' + err,
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, walletAddress: createdUser.walletAddress });
};

//API to login user
const login = async (req, res, next) => {
  const errors = validator.validateCheck(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { walletAddress } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ walletAddress: walletAddress });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.' + err,
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      'Invalid Wallet Address, could not log you in.',
      403
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.walletAddress,
  });
};
module.exports = {
  register,
  login,
  getUsers,
  getUsersByWalletAddress,
  enterUser,
};
// try {
//   wallet = new ethers.Wallet(privateKey, provider);
// } catch (err) {
//   const error = new HttpError(
//     "Failed to connect to wallet, please try again later." + err,
//     500
//   );
//   return next(error);
// }
