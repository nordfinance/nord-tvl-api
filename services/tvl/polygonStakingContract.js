'use strict';

const config = require('./config.js');

module.exports = [
  {
    id: 1,
    name: 'NORD-NORD staking',
    stakingContractAddress: '0x9b2311c6D57EA5a65B29223C87C50C59E1D9cF13',
    stakingContractABI: config.nordStakingABI.abi,
    stakingType: 'simple-staking',
    decimals: 18,
  },
  {
    id: 2,
    name: 'NORD-NORD staking - Fixed APY',
    stakingContractAddress: '0xf0882a08D855ec8Ad3f25087dE3FB311A5344b20',
    stakingContractABI: config.nordStakingWithUnboundingDurationAndFixedApyABI.abi,
    stakingType: 'fixed-apy-staking',
    decimals: 18,
  },
  {
    id: 3,
    name: 'KRIDA-KRIDA staking - Variable APY',
    stakingContractAddress: '0xeE716de554A35643f2DA36f1fA7bE8a014dd0472',
    stakingContractABI: config.nordStakingABI.abi,
    stakingType: 'krida-variable-apy-staking',
    decimals: 18,
  }
];
