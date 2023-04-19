const { ethers } = require("hardhat");
const {
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await ethers.getContract("GovernanceToken");
  const timeLock = await ethers.getContract("TimeLock");

  log("Deploying TimeLock.....");
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    log: true,
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
  });
  log(`Deployed governor contract to address ${governorContract.address}`);
};

module.exports.tags = ["all", "governorContract"];
