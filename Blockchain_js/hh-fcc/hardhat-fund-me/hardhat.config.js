require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */

GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli";
PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

module.exports = {
	// solidity: "0.8.8",
	solidity: {
		compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
	},
	defaultNetwork: "hardhat",
	networks: {
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 5,
			blockConfirmations: 6
		},
		localhost: {
			url: "http://127.0.0.1:8545/",
			// accounts: thanks hardhat!
			chainId: 31337
		}
	},
	namedAccounts: {
		deployer: {
			default: 0, // here this will by default take the first account as deployer
			1: 0
		}
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY
	},
	gasReporter: {
		enabled: true,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: COINMARKETCAP_API_KEY, //get file for ETH to USD
		token: "ETH" //polygon
	},
	paths: { tests: "./test/unit" }
};

task("accounts", "Prints the list of accounts", async () => {
	const accounts = await ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});
