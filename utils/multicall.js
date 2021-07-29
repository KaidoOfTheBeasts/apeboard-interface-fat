const Provider = require('ethers-multicall').Provider;
const ethers = require('ethers');

module.exports = async function (calls, url) {
  const provider = new ethers.providers.JsonRpcProvider(url, { name: "binance", chainId: 56 })
  const ethcallProvider = new Provider(provider);
  await ethcallProvider.init();
  return await ethcallProvider.all(calls);
}
