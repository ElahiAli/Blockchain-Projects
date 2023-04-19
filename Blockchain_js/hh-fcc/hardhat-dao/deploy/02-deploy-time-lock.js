const { ethers } = require("hardhat");
const { MIN_DELAY } = require("../helper-hardhat-config");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying TimeLock.....");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    log: true,
    args: [MIN_DELAY, [], [], deployer],
  });
  log(`Deployed time Lock to address ${timeLock.address}`);
};

module.exports.tags = ["all", "timeLock"];
