'use strict';

const config = require('./config.js');

module.exports = [
  {
    id: 1,
    name: 'NORD Quant Fund',
    symbol: 'USDC',
    description: 'USDC Vault',
    vaultSymbol: 'nQNTS',
    erc20address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    vaultContractAddress: '0xa10105C9BFaB2942b542aacBc3835fe4615A8191',
    vaultContractABI: config.vaultContractABI.abi,
    balance: 0,
    vaultBalance: 0,
    decimals: 6,
    deposit: true,
    depositAll: false,
    withdraw: true,
    withdrawAll: false,
    lastMeasurement: 17787539,
    price_id: 'usd-coin',
  }
];
