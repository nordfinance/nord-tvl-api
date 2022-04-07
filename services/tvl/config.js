'use strict';

const vaultContractABI = require('../../abi/vault');
const nordStakingABI = require('../../abi/NordStaking');
const nordStakingWithUnboundingDurationAndFixedApyABI = require('../../abi/NordStakingWithUnboundingDurationAndFixedApy');
const erc20ABI = require('../../abi/erc20');

module.exports = {
  delayTime: 0,
  vaultContractABI,
  nordStakingABI,
  nordStakingWithUnboundingDurationAndFixedApyABI,
  erc20ABI
};
