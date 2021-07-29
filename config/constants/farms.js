const tokens = require('./tokens');

const farms = [
  {
    pid: 0,
    lpSymbol: 'FAT',
    lpAddresses: '0x73280E2951785F17Acc6Cb2A1D0C4d65031D54B3',
    token: tokens.fat,
    quoteToken: tokens.fat,
    rewardToken: tokens.fat
  },
  /**
   * All farms below here are from v1 and are to be set to 0x
   */
  {
    pid: 1,
    lpSymbol: 'FAT-BNB LP',
    lpAddresses: '0xFb477B591F92401475734915AC614D7FE4A2a0bB',
    token: tokens.fat,
    quoteToken: tokens.wbnb,
    rewardToken: tokens.fat
  },
  {
    pid: 2,
    lpSymbol: 'FAT-BUSD LP',
    lpAddresses: '0xA3dDd8109BC01CC5431B205a39edeBcaFf361A3D',
    token: tokens.fat,
    quoteToken: tokens.busd,
    rewardToken: tokens.fat
  },
  {
    pid: 5,
    lpSymbol: 'FAT-BNB LP',
    lpAddresses: '0xdc538070bc07c53c168cc3872c6076ab01758ea4',
    token: tokens.fat,
    quoteToken: tokens.wbnb,
    rewardToken: tokens.fat,
    provider : "pancake"
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: '0xdaA1029D2560f5DDD3F4ee6F9Fab174751336656',
    token: tokens.busd,
    quoteToken: tokens.wbnb,
    rewardToken: tokens.fat
  },
  {
    pid: 4,
    lpSymbol: 'BUSD-USDT LP',
    lpAddresses: '0x074aAf13f40D60c999f0017490Fb5De7a3aCe0C0',
    token: tokens.busd,
    quoteToken: tokens.usdt,
    rewardToken: tokens.fat
  },
];

module.exports = farms;
