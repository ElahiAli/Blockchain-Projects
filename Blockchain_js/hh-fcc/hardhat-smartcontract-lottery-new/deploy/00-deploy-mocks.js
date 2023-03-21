const { deployments, getNamedAccounts, network, ethers } = require("hardhat")
const { developmentChains, BASE_FEE, GAS_PRICE_LINK } = require("../helper-hardhat-config")

module.exports = async function (deployments, getNamedAccounts) {
    const { deploy, log } = deployments
    const deployer = (await getNamedAccounts()).deployer
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Dploying Mock...")
        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            log: true,
            args: args,
        })
        log("Mock deployed!")
        log("------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
