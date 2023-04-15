require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key";
const REPORT_GAS = process.env.REPORT_GAS || false;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // forking: { url: MAINNET_RPC_URL },
    },
    localhost: {
      chainId: 31337,
    },
  },
  // etherscan: {
  //   // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
  //   apiKey: {
  //     sepolia: ETHERSCAN_API_KEY,
  //     polygon: POLYGONSCAN_API_KEY,
  //   },
  //   customChains: [
  //     {
  //       network: "goerli",
  //       chainId: 5,
  //       urls: {
  //         apiURL: "https://api-goerli.etherscan.io/api",
  //         browserURL: "https://goerli.etherscan.io",
  //       },
  //     },
  //   ],
  // },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    client: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.8.8" },
      { version: "0.4.24" },
      { version: "0.4.19" },
      { version: "0.6.12" },
    ],
  },
  // mocha: {
  //     timeout: 500000, // 500 seconds max for running tests
  // },
};
