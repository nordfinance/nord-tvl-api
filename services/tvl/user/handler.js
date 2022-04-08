'use strict';
require('dotenv').config();
const handler = require('../../../lib/handler');
const _ = require('lodash');
const Web3 = require("web3");
const web3Ethereum = new Web3();
const web3Polygon = new Web3();
const web3Avalanche = new Web3();

const infuraUrlEthereum =process.env.WEB3_ENDPOINT_ETHEREUM;
const infuraUrlPolygon  =process.env.WEB3_ENDPOINT_POLYGON;
const infuraUrlAvalanche  =process.env.WEB3_ENDPOINT_AVALANCHE;

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const vaultsSavingsEthereum = require('../vaultsSavingsEthereum');
const vaultsSavingsPolygon = require('../vaultsSavingsPolygon');
const vaultsSavingsAvalanche = require('../vaultsSavingsAvalanche');
const vaultsAdvisoryEthereum = require('../vaultsAdvisoryEthereum');
const vaultsAdvisoryPolygon = require('../vaultsAdvisoryPolygon');
const nordStakingEthereum = require('../ethereumStakingContract');
const nordStakingPolygon = require('../polygonStakingContract');
const nordStakingAvalanche = require('../avalancheStakingContract');

web3Ethereum.setProvider(new web3Ethereum.providers.HttpProvider(infuraUrlEthereum));
web3Polygon.setProvider(new web3Polygon.providers.HttpProvider(infuraUrlPolygon));
web3Avalanche.setProvider(new web3Avalanche.providers.HttpProvider(infuraUrlAvalanche));

let totalUsdcHolding,totalUsdtHolding,totalDaiHolding;
const readVault = async (vault, vaultContract, userAddress) => {
    const {
      name,
      symbol,
      description,
      vaultSymbol,
      decimals,
      vaultContractABI: abi,
      vaultContractAddress: address,
      erc20address: tokenAddress,
    } = vault;
    console.log(`Reading vault ${vault.name}`);
    if (!abi || !address) {
      console.log(`Vault ABI not found: ${name}`);
      return null;
    }


    console.log("Reading underlyingBalanceWithInvestmentForHolder from vault");
    let underlyingBalanceWithInvestmentForHolder= await vaultContract.methods
      .underlyingBalanceWithInvestmentForHolder(userAddress)
      .call();
      underlyingBalanceWithInvestmentForHolder = underlyingBalanceWithInvestmentForHolder / Math.pow(10,decimals);
    console.log("underlyingBalanceWithInvestmentForHolder = "+underlyingBalanceWithInvestmentForHolder.toString());

    if(symbol == 'USDC'){
      totalUsdcHolding +=  underlyingBalanceWithInvestmentForHolder;
    }else if(symbol == 'USDT'){
      totalUsdtHolding +=  underlyingBalanceWithInvestmentForHolder;
    }else if(symbol == 'DAI'){
      totalDaiHolding +=  underlyingBalanceWithInvestmentForHolder;
    }else{

    }
    return underlyingBalanceWithInvestmentForHolder;
  };

  const readStakingContract = async (stakingContract, stakingContractInstance, userAddress) => {
    const {
      stakingContractABI: abi,
      stakingContractAddress: address,
      stakingType: type
    } = stakingContract;
    if (!abi || !address) {
      console.log(`Staking ABI not found: ${stakingContractAddress}`);
      return null;
    }
    let userBalance;
    if(type == "simple-staking" || type == "lp-staking" || type == "krida-variable-apy-staking"){
      userBalance= await stakingContractInstance.methods
      .balanceOf(userAddress)
      .call();
    }else{
      userBalance= await stakingContractInstance.methods
      .getUserData(userAddress)
      .call();
      userBalance = JSON.parse(userBalance[0]);
    }
    userBalance = userBalance / Math.pow(10,18);
    console.log("Staking userBalance = "+userBalance.toString());
    return userBalance;
  };

const getSavingsVaultsTvl = async (userAddress) => {
    let totalSavingsVaultsTvlEthereum = 0;
    let totalSavingsVaultsTvlPolygon = 0;
    let totalSavingsVaultsTvlAvalanche = 0;

    for (const vault of vaultsSavingsEthereum) {
        const {
            vaultContractABI: abi,
            vaultContractAddress: address,
          } = vault;

        const vaultContract = new web3Ethereum.eth.Contract(abi, address);

        const vaultTvl = await readVault(vault, vaultContract, userAddress);
        totalSavingsVaultsTvlEthereum += vaultTvl;
    }

    for (const vault of vaultsSavingsPolygon) {
        const {
            vaultContractABI: abi,
            vaultContractAddress: address,
          } = vault;
        const vaultContract = new web3Polygon.eth.Contract(abi, address);
        const vaultTvl = await readVault(vault, vaultContract, userAddress);
        totalSavingsVaultsTvlPolygon += vaultTvl;
    }
    for (const vault of vaultsSavingsAvalanche) {
        const {
            vaultContractABI: abi,
            vaultContractAddress: address,
          } = vault;
      const vaultContract = new web3Avalanche.eth.Contract(abi, address);
        const vaultTvl = await readVault(vault, vaultContract, userAddress);
      totalSavingsVaultsTvlAvalanche += vaultTvl;
    }
    let totalSavingsVaultsTvl = totalSavingsVaultsTvlEthereum + totalSavingsVaultsTvlPolygon + totalSavingsVaultsTvlAvalanche;
    console.log("totalSavingsVaultsTvlEthereum = "+totalSavingsVaultsTvlEthereum.toString());
    console.log("totalSavingsVaultsTvlPolygon = "+totalSavingsVaultsTvlPolygon.toString());
    console.log("totalSavingsVaultsTvlAvalanche = "+totalSavingsVaultsTvlAvalanche.toString());
    console.log("totalSavingsVaultsTvl = "+totalSavingsVaultsTvl.toString());
    let savingsTvl = {
        'totalSavings':totalSavingsVaultsTvl,
        'ethereum':totalSavingsVaultsTvlEthereum,
        'polygon':totalSavingsVaultsTvlPolygon,
        'avalanche':totalSavingsVaultsTvlAvalanche
    };
    return savingsTvl;
}

const getAdvisoryVaultsTvl = async (userAddress) => {
    let totalAdvisoryVaultsTvlEthereum=0;
    let totalAdvisoryVaultsTvlPolygon=0;
    for (const vault of vaultsAdvisoryEthereum) {
        const {
            vaultContractABI: abi,
            vaultContractAddress: address,
          } = vault;
        const vaultContract = new web3Ethereum.eth.Contract(abi, address);
        const vaultTvl = await readVault(vault, vaultContract, userAddress);
        totalAdvisoryVaultsTvlEthereum += vaultTvl;
    }

    for (const vault of vaultsAdvisoryPolygon) {
      const {
          vaultContractABI: abi,
          vaultContractAddress: address,
        } = vault;
      const vaultContract = new web3Polygon.eth.Contract(abi, address);
      const vaultTvl = await readVault(vault, vaultContract, userAddress);
      totalAdvisoryVaultsTvlPolygon += vaultTvl;
    }
    let totalAdvisoryVaultsTvl = totalAdvisoryVaultsTvlEthereum + totalAdvisoryVaultsTvlPolygon;
    console.log("totalAdvisoryVaultsTvlEthereum = "+totalAdvisoryVaultsTvlEthereum.toString());
    console.log("totalAdvisoryVaultsTvlPolygon = "+totalAdvisoryVaultsTvlPolygon.toString());
    console.log("totalAdvisoryVaultsTvl = "+totalAdvisoryVaultsTvl.toString());
    let advisoryTvl = {
        'totalAdvisory':totalAdvisoryVaultsTvl,
        'ethereum':totalAdvisoryVaultsTvlEthereum,
      'polygon':totalAdvisoryVaultsTvlPolygon,
      'avalanche':0
  };
  return advisoryTvl;
}

const calculateLpStakingTvlValue = async (lpPairAddress, ethTokenInstance, nordTokenInstance, lpTokenInstance, stakingTvl, nordCurrentPrice) => {
  //Value of 1 NORD<->ETH LP token = Total value of pool / Circulating supply of LP
  //                               = 345754.37 / 1359.73
  //                               = 254.281636796
  let response = await CoinGeckoClient.coins.fetch('ethereum', {});
  let ethCurrentPrice = (response.data.market_data.current_price.usd);
  console.log("ethCurrentPrice = ", ethCurrentPrice);

  
  let ethBalanceOnLpStakingContract = (await ethTokenInstance.methods.balanceOf(lpPairAddress).call()) / Math.pow(10,18);
  console.log("ethBalanceOnLpStakingContract = ", ethBalanceOnLpStakingContract);

  let nordBalanceOnLpStakingContract = (await nordTokenInstance.methods.balanceOf(lpPairAddress).call()) / Math.pow(10,18);
  console.log("nordBalanceOnLpStakingContract = ", nordBalanceOnLpStakingContract);


  let totalValueOfPool = (ethBalanceOnLpStakingContract * ethCurrentPrice) + (nordBalanceOnLpStakingContract * nordCurrentPrice);
  console.log("totalValueOfPool = ", totalValueOfPool);

  let circulatingSupply = (await lpTokenInstance.methods.totalSupply().call()) / Math.pow(10,18);
  console.log("circulatingSupply = ", circulatingSupply);

  let lpTokenPrice = totalValueOfPool / circulatingSupply;
  console.log("lpTokenPrice = ", lpTokenPrice);

  return (stakingTvl * lpTokenPrice);
}

const getStakingTvl = async (userAddress, nordCurrentPrice) => {
    let totalStakingTvlEthereum=0;
    let totalStakingTvlPolygon=0;
    let totalStakingTvlAvalanche=0;
    let totalLpStakingTvlEthereum=0;
    let totalLpStakingTvlPolygon=0;
    let totalLpStakingTvlAvalanche=0;
    let totalKridaStakingTvlPolygon=0;

    for (const stakingContract of nordStakingEthereum) {
        const {
            stakingContractABI: abi,
            stakingContractAddress: address,
            stakingType: type,
          } = stakingContract;

        const stakingContractInstance = new web3Ethereum.eth.Contract(abi, address);

        let stakingTvl = await readStakingContract(stakingContract, stakingContractInstance, userAddress);
        if(type == "lp-staking"){
          const {
            lpPairAddress: lpPairAddress,
            ethereumAddress: ethereumAddress,
            nordAddress: nordAddress,
            erc20ABI: erc20ABI
          } = stakingContract;
          const ethTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, ethereumAddress);
          const nordTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, nordAddress);
          const lpTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, lpPairAddress);
          stakingTvl = await calculateLpStakingTvlValue(lpPairAddress, ethTokenInstance, nordTokenInstance, lpTokenInstance, stakingTvl, nordCurrentPrice);
          totalLpStakingTvlEthereum += stakingTvl;
        }
        else{
          totalStakingTvlEthereum += stakingTvl;
        }
    }

    for (const stakingContract of nordStakingPolygon) {
        const {
            stakingContractABI: abi,
            stakingContractAddress: address,
            stakingType: type,
          } = stakingContract;
        const stakingContractInstance = new web3Polygon.eth.Contract(abi, address);
        let stakingTvl = await readStakingContract(stakingContract, stakingContractInstance, userAddress);
        if(type == "lp-staking"){
          const {
            lpPairAddress: lpPairAddress,
            ethereumAddress: ethereumAddress,
            nordAddress: nordAddress,
            erc20ABI: erc20ABI
          } = stakingContract;
          const ethTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, ethereumAddress);
          const nordTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, nordAddress);
          stakingTvl = calculateLpStakingTvlValue(lpPairAddress, ethTokenInstance, nordTokenInstance, lpTokenInstance,stakingTvl, nordCurrentPrice);
          totalLpStakingTvlPolygon += stakingTvl;
        }
        else if(type == "krida-variable-apy-staking"){
          totalKridaStakingTvlPolygon += stakingTvl;
        }
        else{
          totalStakingTvlPolygon += stakingTvl;
        }
    }

    for (const stakingContract of nordStakingAvalanche) {
      const {
          stakingContractABI: abi,
          stakingContractAddress: address,
          stakingType: type,
        } = stakingContract;
      const stakingContractInstance = new web3Avalanche.eth.Contract(abi, address);
        let stakingTvl = await readStakingContract(stakingContract, stakingContractInstance, userAddress);
      if(type == "lp-staking"){
        const {
          lpPairAddress: lpPairAddress,
          ethereumAddress: ethereumAddress,
          nordAddress: nordAddress,
          erc20ABI: erc20ABI
        } = stakingContract;
        const ethTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, ethereumAddress);
        const nordTokenInstance = new web3Ethereum.eth.Contract(erc20ABI, nordAddress);
        stakingTvl = calculateLpStakingTvlValue(lpPairAddress, ethTokenInstance, nordTokenInstance, lpTokenInstance,stakingTvl, nordCurrentPrice);
        totalLpStakingTvlAvalanche += stakingTvl;
      }
      else{
        totalStakingTvlAvalanche += stakingTvl;
      }
    }

    let totalStakingTvl = totalStakingTvlEthereum + totalStakingTvlPolygon + totalStakingTvlAvalanche;
    console.log("totalStakingTvlEthereum = "+totalStakingTvlEthereum.toString());
    console.log("totalStakingTvlPolygon = "+totalStakingTvlPolygon.toString());
    console.log("totalStakingTvlAvalanche = "+totalStakingTvlAvalanche.toString());
    console.log("totalStakingTvl = "+totalStakingTvl.toString());
    console.log("totalKridaStakingTvlPolygon = "+totalKridaStakingTvlPolygon.toString());

    let totalLpStakingTvl = totalLpStakingTvlEthereum + totalLpStakingTvlPolygon + totalLpStakingTvlAvalanche;
    console.log("totalLpStakingTvlEthereum = "+totalLpStakingTvlEthereum.toString());
    console.log("totalLpStakingTvlPolygon = "+totalLpStakingTvlPolygon.toString());
    console.log("totalLpStakingTvlAvalanche = "+totalLpStakingTvlAvalanche.toString());
    console.log("totalLpStakingTvl = "+totalLpStakingTvl.toString());

    let stakingTvl = {
        'totalStaking':totalStakingTvl,
        'ethereum':totalStakingTvlEthereum,
        'polygon':totalStakingTvlPolygon,
        'avalanche':totalStakingTvlAvalanche,
        'totalKridaStakingTvlPolygon':totalKridaStakingTvlPolygon
    };
    let lpStakingTvl = {
      'totalLpStaking':totalLpStakingTvl,
      'ethereum':totalLpStakingTvlEthereum,
      'polygon':totalLpStakingTvlPolygon,
      'avalanche':totalLpStakingTvlAvalanche
    };

    return {stakingTvl, lpStakingTvl};
}

const getTvlStatistics = async (userAddress) => {

    let response = await CoinGeckoClient.coins.fetch('nord-finance', {});

    let nordCurrentPrice = (response.data.market_data.current_price.usd);
    console.log("nordCurrentPrice = ", nordCurrentPrice);

    let kridaCurrentPrice = (response.data.market_data.current_price.usd);
    console.log("kridaCurrentPrice = ", kridaCurrentPrice);

    let savingsVaultsTvl = await getSavingsVaultsTvl();
    let advisoryVaultsTvl = await getAdvisoryVaultsTvl();
    let {stakingTvl, lpStakingTvl} = await getStakingTvl(nordCurrentPrice);

    let totalTvl = (savingsVaultsTvl.totalSavings) + (advisoryVaultsTvl.totalAdvisory) + ((stakingTvl.totalStaking)*nordCurrentPrice) + lpStakingTvl.totalLpStaking + ((stakingTvl.totalKridaStakingTvlPolygon)*kridaCurrentPrice);
    var ethereumTvl = (savingsVaultsTvl.ethereum) + (advisoryVaultsTvl.ethereum) + ((stakingTvl.ethereum) * nordCurrentPrice) + (lpStakingTvl.ethereum);
    var polygonTvl = (savingsVaultsTvl.polygon) + (advisoryVaultsTvl.polygon) + ((stakingTvl.polygon) * nordCurrentPrice) + ((stakingTvl.totalKridaStakingTvlPolygon) * kridaCurrentPrice) + (lpStakingTvl.polygon);
    var avalancheTvl = (savingsVaultsTvl.avalanche) + (advisoryVaultsTvl.avalanche) + ((stakingTvl.avalanche) * nordCurrentPrice) + (lpStakingTvl.avalanche);

    let tvlStatistics = {
        'tvl': {
            'totalTvl': totalTvl,
            'ethereum':ethereumTvl,
            'polygon':polygonTvl,
            'avalanche':avalancheTvl,
            'savings':savingsVaultsTvl,
            'advisory':advisoryVaultsTvl,
            'staking':stakingTvl,
            'lpStaking':lpStakingTvl,
            'totalUsdcHolding':totalUsdcHolding,
            'totalUsdtHolding':totalUsdtHolding,
            'totalDaiHolding':totalDaiHolding
        }
    } 
    return tvlStatistics;
  };

module.exports.handler = handler(async (event) => {
  const userAddress = event.queryStringParameters.useraddress;
  console.log("userAddress = ",userAddress);
  totalUsdcHolding=0;totalUsdtHolding=0;totalDaiHolding = 0;
  const tvlStatistics = await getTvlStatistics(userAddress);
  console.log(JSON.stringify(tvlStatistics));
  return tvlStatistics;
});
