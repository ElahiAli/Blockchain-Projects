const { ethers } = require("hardhat");
const { moveTime } = require("../utils/move-time");
const {
  NEW_STORE_VALUE,
  FUNCTION_CALL,
  PROPOSAL_DESCRIPTION,
  MIN_DELAY,
  developmentChains,
} = require("../helper-hardhat-config");
const { moveBlock } = require("../utils/move-block");

async function queueAndExcution() {
  const args = NEW_STORE_VALUE;
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNCTION_CALL, args);
  // our proposal description get hash on chain so here our queue is going to look for our description hash
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing....");
  const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash);
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlock(1);
  }

  console.log("Excuting....");
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log(`New Box Value: ${boxNewValue.toString()}`);
}

queueAndExcution()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
