const networkConfig = {
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", //https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "1242",
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

const MIN_DELAY = 3600;
const VOTING_PERIOD = 5;
const VOTING_DELAY = 1;
const QUORUM_PERCENTAGE = 4;
const developmentChains = ["hardhat", "localhost"];
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const NEW_STORE_VALUE = [777];
const FUNCTION_CALL = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 777 in the box";
const PROPOSAL_FILE = "proposal.json";

module.exports = {
  networkConfig,
  developmentChains,
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  NEW_STORE_VALUE,
  FUNCTION_CALL,
  PROPOSAL_DESCRIPTION,
  PROPOSAL_FILE,
};
