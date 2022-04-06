'use strict';

const config = require('./config.js');

module.exports = [
  {
    id: 1,
    name: 'Crypto Major Index',
    symbol: 'USDC',
    description: 'USDC Vault',
    vaultSymbol: 'nCMI',
    erc20address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    vaultContractAddress: '0xA55D00D18E2f82B7588F1Ffb3597c3A958f7d545',
    vaultContractABI: config.vaultContractABI.abi,
    balance: 0,
    vaultBalance: 0,
    decimals: 6,
    deposit: true,
    depositAll: false,
    withdraw: true,
    withdrawAll: false,
    lastMeasurement: 13523033,
    price_id: 'usd-coin',
  }
];
