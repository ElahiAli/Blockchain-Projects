const { run } = require("hardhat");

// verifying contracts
async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  // *second perameter* ; try used because of await.
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

module.exports = { verify };
