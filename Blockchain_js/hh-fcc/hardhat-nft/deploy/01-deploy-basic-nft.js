const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("-------------------------------------------------");
    const args = [];

    const basicNFT = await deploy("basicNFT", {
        from: deployer,
        log: true,
        args: args,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(basicNFT.address, args);
    }
    log("Deployed.");
    log("-----------------------------------------------------------");
};

module.exports.tags = ["all", "main"];
