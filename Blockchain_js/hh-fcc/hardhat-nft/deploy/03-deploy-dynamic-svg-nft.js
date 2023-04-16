const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    ethUsdPriceFeed = await ethers.getContract("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdPriceFeed.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const lowSvg = await fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf8" });
  const highSvg = await fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf8" });
  args = [ethUsdPriceFeedAddress, lowSvg, highSvg];

  log("---------------------------------------------------");
  const dynamicSvgNft = await deploy("dynamicNft", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(dynamicSvgNft.address, args);
  }
};

module.exports.tags = ["all", "dynamicSvg", "main"];
