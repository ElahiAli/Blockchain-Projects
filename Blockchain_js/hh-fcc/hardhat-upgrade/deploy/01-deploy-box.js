const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("---------------------");
  const args = [];
  const box = await deploy("Box", {
    // Box renamed to Box_Implementation
    from: deployer,
    log: true,
    args: args,
    proxy: {
      proxyContracts: "OpenzeppelinTransparentProxy",
      viaAdminContract: {
        name: "BoxProxyAdmin", // Admin contract
        artifact: "BoxProxyAdmin", //
      },
    },
  });

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("verifying....");
    await verify(box.address, args);
  }
};
