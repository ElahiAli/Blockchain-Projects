const { network } = require("hardhat");

async function moveTime(amount) {
  console.log("Moving time...");

  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved forward ${amount} seconds.`);
}

module.exports = { moveTime };
