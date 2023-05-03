const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying BasicNft Contract....");
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("Deployed!");

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying....");
        await verify(basicNft.address, []);
    }
};

module.exports.tags = ["all", "basicNft"];
