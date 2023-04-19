const { ethers } = require("hardhat");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    log: true,
    args: [],
  });
  log(`Deployed governance token to address ${governanceToken.address}`);

  await delegate(governanceToken.address, deployer);
  console.log("Delegated!");
};

const delegate = async function (governanceTokenAddress, delegatedAccount) {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`);
};

module.exports.tags = ["all", "governanceToken"];
