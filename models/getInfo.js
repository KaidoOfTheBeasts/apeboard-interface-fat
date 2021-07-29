const getInfo = {};
const Contract = require('ethers-multicall').Contract;
const multiCall = require('../utils/multicall');
const erc20Abi = require('../abi/erc20/abi.json');
const lpAbi = require('../abi/farm/pairToken/abi.json');
const masterChefAbi = require('../abi/farm/masterFatAnimal/abi.json');
const bandOracleAbi = require('../abi/aggregator/bandOracle/abi.json');
const contracts = require('../config/constants/contracts');
const tokens = require('../config/constants/tokens');
const farms = require('../config/constants/farms');
const formatBalance = require('../utils/formatBalance');
const BigNumber = require('bignumber.js');

const BSC_BLOCK_TIME = 3;
const FAT_PER_BLOCK = new BigNumber(10);
const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365); // 10512000

const nodes = [
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed.binance.org'
]

const getNodeUrl = () => {
  const randomIndex = Math.floor(Math.random() * (nodes.length - 1))
  return nodes[randomIndex]
};

getInfo.fetchFarms = async function (allFarms, targetAddress) {
  const price = await getInfo.fetchPrice();
  const data = await Promise.all(
    allFarms.map(async (farm)=>{
      const tokenAContract = new Contract(farm.token.address, erc20Abi);
      const tokenBContract = new Contract(farm.quoteToken.address, erc20Abi);
      const farmContract = new Contract(farm.lpAddresses, lpAbi);
      const masterChefContract = new Contract(contracts.masterChef, masterChefAbi);

      const lpFarm = farm.lpAddresses;
      const balanceOfACall = tokenAContract.balanceOf(lpFarm);
      const balanceOfBCall = tokenBContract.balanceOf(lpFarm);
      const totalSupplyCall = farmContract.totalSupply();
      const balanceOfFarmCall = masterChefContract.userInfo(farm.pid, targetAddress);
      const pendingTokenCall = masterChefContract.pendingFat(farm.pid, targetAddress);
      const poolInfoCall = masterChefContract.getPoolInfo(farm.pid);
      const totalAllocCall = masterChefContract.totalAllocPoint();
      const currentStakingCall = masterChefContract.currentStaking();

      const [balanceOfA, balanceOfB, totalSupply, balanceOfFarm, pendingToken, poolInfo, totalAlloc, currentStaking] = await multiCall([balanceOfACall, balanceOfBCall, totalSupplyCall, balanceOfFarmCall, pendingTokenCall, poolInfoCall, totalAllocCall, currentStakingCall], getNodeUrl());

      const portionTokenA = formatBalance.getBalanceNumber(balanceOfFarm.amount.toString()) / formatBalance.getBalanceNumber(totalSupply.toString()) * formatBalance.getBalanceNumber(balanceOfA.toString());
      const portionTokenB = formatBalance.getBalanceNumber(balanceOfFarm.amount.toString()) / formatBalance.getBalanceNumber(totalSupply.toString()) * formatBalance.getBalanceNumber(balanceOfB.toString());

      let totalStakingTokenInPool;
      const tokenPerBlock = FAT_PER_BLOCK * poolInfo.allocPoint.toString() / totalAlloc.toString();
      const totalRewardPricePerYear = new BigNumber(price.FAT).times(tokenPerBlock).times(BLOCKS_PER_YEAR);
      if (farm.pid === 0) {
        totalStakingTokenInPool = formatBalance.getBalanceNumber(currentStaking.toString()) * price.FAT;
      } else {
        totalStakingTokenInPool = (formatBalance.getBalanceNumber(balanceOfA.toString()) * price[farm.token.symbol]) + (formatBalance.getBalanceNumber(balanceOfB.toString()) * price[farm.quoteToken.symbol]);
      }
      const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100).toNumber();

      if (farm.pid === 0) {
        return {
          tokens: [
            {
              symbol: farm.token.symbol,
              address: farm.token.address.toLowerCase(),
              logo: farm.token.logo,
              balance: formatBalance.getBalanceNumber(balanceOfFarm.amount.toString()),
              price: price.FAT,
            },
          ],
          balance: formatBalance.getBalanceNumber(balanceOfFarm.amount.toString()),
          apr: apr,
          rewards: [
            {
              symbol: farm.rewardToken.symbol,
              address: farm.rewardToken.address.toLowerCase(),
              logo: farm.rewardToken.logo,
              balance: formatBalance.getBalanceNumber(pendingToken.toString()),
              price: price.FAT
            }
          ]
        };
      } else {
        return {
          tokens: [
            {
              symbol: farm.token.symbol,
              address: farm.token.address.toLowerCase(),
              logo: farm.token.logo,
              balance: portionTokenA,
              price: price[farm.token.symbol],
            },
            {
              symbol: farm.quoteToken.symbol,
              address: farm.quoteToken.address.toLowerCase(),
              logo: farm.quoteToken.logo,
              balance: portionTokenB,
              price: price[farm.quoteToken.symbol],
            }
          ],
          balance: formatBalance.getBalanceNumber(balanceOfFarm.amount.toString()),
          apr: apr,
          lpAddress: lpFarm.toLowerCase(),
          rewards: [
            {
              symbol: farm.rewardToken.symbol,
              address: farm.rewardToken.address.toLowerCase(),
              logo: farm.rewardToken.logo,
              balance: formatBalance.getBalanceNumber(pendingToken.toString()),
              price: price.FAT
            }
          ]
        };
      }
    }));

  return data.filter(farming=>farming.balance > 0);
};

getInfo.fetchPrice = async function () {
  const FAT_BUSD_FARM_ID = 2;
  
  const tokenFatContract = new Contract(tokens.fat.address, erc20Abi);
  const tokenBusdContract = new Contract(tokens.busd.address, erc20Abi);
  const bandOracleContract = new Contract(contracts.bandProtocol, bandOracleAbi);
  const balanceOfFatCall = tokenFatContract.balanceOf(farms[FAT_BUSD_FARM_ID].lpAddresses);
  const balanceOfBusdCall = tokenBusdContract.balanceOf(farms[FAT_BUSD_FARM_ID].lpAddresses);
  const oracleBNBCall = bandOracleContract.getReferenceData('BNB', 'BUSD');
  const [balanceOfFat, balanceOfBusd, bnb] = await multiCall([balanceOfFatCall, balanceOfBusdCall, oracleBNBCall], getNodeUrl());

  return {
    WBNB: formatBalance.getBalanceNumber(bnb.rate.toString()),
    FAT: formatBalance.getBalanceNumber(balanceOfBusd.toString()) / formatBalance.getBalanceNumber(balanceOfFat.toString()),
    USDC: 1,
    USDT: 1,
    BUSD: 1
  }
}

module.exports = getInfo;
