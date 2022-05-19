const user = require('../models/user-model');
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

const awardWinner = async (req, res, next) => {
  if (validator.validateCheck(req, res)) {
    return;
  }

  const { privateKey } = req.body;
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

    tx = await contractWithWallet.awardwinner();

    await tx.wait();
  } catch (err) {
    const error = new HttpError(
      'Failed to get winner, please try again later.' + err,
      500
    );
    return next(error);
  }

  res.status(200).send(tx);
};

module.exports = { awardWinner };
