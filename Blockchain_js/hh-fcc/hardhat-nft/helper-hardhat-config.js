const networkConfig = {
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", //https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "0",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000", // 0.01 ETH
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },

  31337: {
    name: "localhost",
    // ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500", // 500,000 gas
  },
};

const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";
const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
};
