'use strict';

const config = require('./config.js');

module.exports = [
  {
    id: 1,
    name: 'USD Coin',
    symbol: 'USDC',
    description: 'USD Coin',
    vaultSymbol: 'nUSDC',
    erc20address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    vaultContractAddress: '0x8a5Ae804Da4924081663D4C5DaB4DC9BB7092E2E',
    vaultContractABI: config.vaultContractABI.abi,
    balance: 0,
    vaultBalance: 0,
    decimals: 6,
    deposit: true,
    depositAll: false,
    withdraw: true,
    withdrawAll: false,
    lastMeasurement: 	15970437,
    price_id: 'usd-coin',
  },
  {
    id: 2,
    name: 'USDT',
    symbol: 'USDT',
    description: 'Tether USD',
    vaultSymbol: 'nUSDT',
    erc20address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    vaultContractAddress: '0xa4dbb459fb9051b976947d2d8ab74477e1720a73',
    vaultContractABI: config.vaultContractABI.abi,
    balance: 0,
    vaultBalance: 0,
    decimals: 6,
    deposit: true,
    depositAll: true,
    withdraw: true,
    withdrawAll: true,
    lastMeasurement: 	15971025,
    price_id: 'tether',
  },
  {
    id: 3,
    name: 'DAI',
    symbol: 'DAI',
    description: 'DAI Stablecoin',
    vaultSymbol: 'nDAI',
    erc20address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    vaultContractAddress: '0xeE2dEf710a8a0021DCbF99C4cD7f69Dc536fc57b',
    vaultContractABI: config.vaultContractABI.abi,
    balance: 0,
    vaultBalance: 0,
    decimals: 18,
    deposit: true,
    depositAll: true,
    withdraw: true,
    withdrawAll: true,
    lastMeasurement: 	15969019,
    price_id: 'dai',
  },
];