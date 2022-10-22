const { networkConfig } = requier("../helper-hardhat-config");

module.exports = async ({ getNameAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNameAccounts();
  const chainId = network.config.chainId;

  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
};
