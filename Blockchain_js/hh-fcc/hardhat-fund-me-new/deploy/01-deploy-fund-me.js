const { network } = require("hardhat");

const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNameAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = getNameAccounts;
	chainId = network.config.chainId;

	const ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"];

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [],
		log: true,
	});
};
