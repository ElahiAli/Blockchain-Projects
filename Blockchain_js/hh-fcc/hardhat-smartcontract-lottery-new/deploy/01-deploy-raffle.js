const { deployments, getNamedAccounts, network } = require("hardhat")

module.exports = async function (deployments, getNamedAccounts) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const raffle = deploy("Raffle", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
}
