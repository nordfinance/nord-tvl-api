'use strict';

const config = require('./config.js');

module.exports = [
  {
    id: 1,
    name: 'NORD-NORD staking - Fixed APY',
    stakingContractAddress: '0x1929aED2175688252C9388df11B162F7303ff926',
    stakingContractABI: config.nordStakingWithUnboundingDurationAndFixedApyABI.abi,
    stakingType: 'fixed-apy-staking',
    decimals: 18,
  },
];
