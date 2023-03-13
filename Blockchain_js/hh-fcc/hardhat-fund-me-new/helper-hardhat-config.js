const networkConfig = {
	5: {
		name: "goerli",
		ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
	},
};

const developmentChain = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;
module.exports = {
	networkConfig,
	developmentChain,
	DECIMALS,
	INITIAL_ANSWER,
};
