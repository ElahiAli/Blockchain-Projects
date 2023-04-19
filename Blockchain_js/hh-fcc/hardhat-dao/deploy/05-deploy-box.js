const { ethers } = require("hardhat");
const { MIN_DELAY } = require("../helper-hardhat-config");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying Box.....");
  const box = await deploy("Box", {
    from: deployer,
    log: true,
    args: [],
  });
  log(`Deployed box contract to address ${box.address}`);

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  log("Transfer successfull!");
};

module.exports.tags = ["all", "box"];
