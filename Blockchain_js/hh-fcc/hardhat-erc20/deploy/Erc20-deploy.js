const { network } = require("hardhat");
const {
  developmentChains,
  INITIAL_SUPPLY,
  TOKEN_NAME,
  TOKEN_SYMBOL,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-function");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [INITIAL_SUPPLY];

  const ourToken = await deploy("OurToken", {
    from: deployer,
    log: true,
    args: args,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verifyMessage(ourToken.address, [
      INITIAL_SUPPLY,
      TOKEN_NAME,
      TOKEN_SYMBOL,
    ]);
  }
};

module.exports.tags = ["all", "token"];
