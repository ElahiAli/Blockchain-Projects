const { network } = require("hardhat");
const {
	developmentChain,
	DECIMALS,
	INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNameAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = getNameAccounts;

	if (developmentChain.includes(network.name)) {
		log("Local network detected! Developing mocks...");
		await deploy("MockV3Aggregator", {
			contract: "MockV3Aggregator",
			from: deployer,
			args: [DECIMALS.INITIAL_ANSWER],
			log: true,
		});
		log("Mocks deployed!");
		log("------------------------------------------------------------------");
	}
};

module.exports.tags = ["all", "mocks"];
