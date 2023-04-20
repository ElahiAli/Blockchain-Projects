const { network } = require("hardhat");

async function moveBlock(amount) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}

module.exports = { moveBlock };
