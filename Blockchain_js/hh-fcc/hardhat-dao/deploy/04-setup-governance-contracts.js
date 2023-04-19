const { ethers } = require("hardhat");
const { ADDRESS_ZERO } = require("../helper-hardhat-config");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await ethers.getContract("GovernanceToken", deployer);
  const governorContract = await ethers.getContract("GovernorContract", deployer);
  const timeLock = await ethers.getContract("TimeLock");

  log("Setting up roles...");
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const proposeTx = await timeLock.grantRole(proposerRole, governorContract.address);
  await proposeTx.wait();
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait();
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};
