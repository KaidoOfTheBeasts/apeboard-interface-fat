const formatBalance = {};

const BigNumber = require('bignumber.js');

formatBalance.getBalanceNumber = (balance, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

formatBalance.getFullDisplayBalance = (balance, decimals = 18) => {
  return new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

formatBalance.formatNumber = (number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return Number(number).toLocaleString(undefined, options)
}

module.exports = formatBalance;
