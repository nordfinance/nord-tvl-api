'use strict';

const config = require('./config.js');

module.exports = [
  {
    id: 1,
    name: 'NORD-NORD staking contract',
    stakingContractAddress: '0x2b9a023415f0feeb88597c1a7d09fdefa0ef5614',
    stakingContractABI: config.nordStakingWithUnboundingDurationAndFixedApyABI.abi,
    stakingType: 'fixed-apy-staking',
    decimals: 18,
  },
  {
    id: 2,
    name: 'NORD-ETH Staking Contract',
    stakingContractAddress: '0x8c043C37a5f16440A1d6919C7F60aBaEd0592b31',
    stakingContractABI: config.nordStakingABI.abi,
    stakingType: 'lp-staking',
    lpPairAddress: '0x5239873C892376799B6Cb49a3CFB1146d4A260b8',
    ethereumAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    nordAddress:'0x6e9730ecffbed43fd876a264c982e254ef05a0de',
    erc20ABI: config.erc20ABI.abi,
    decimals: 18,
  }
];
