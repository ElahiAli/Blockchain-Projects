require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli";
PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      // accounts: thanks hardhat!
      chainId: 31337
    }
  }
};

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
