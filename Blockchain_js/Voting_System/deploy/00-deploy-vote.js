const { network } = require("hardhat");
developmentChains = ["hardhat", "localhost"];

module.exports = async function ({ deployments, getNamedAccounts }) {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	log("Deploying...");
	const vote = await deploy("Vote", {
		from: deployer,
		log: true,
		args: [],
	});

	if (!developmentChains.includes(network.name)) {
		log("Verifying...");
		await verify(vote.address, []);
	}
};

module.exports.tags = ["all", "vote"];
