const { getNamedAccounts, ethers } = require("hardhat")

const { network, ethers, deployments, getNamedAccounts } = requier("hardhat")
const { developmentChains } = requier("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", async function () {
          let raffle, vrfCoordinatorV2Mock

          beforEach(async function () {
              const { deployer } = await getNamedAccounts()
              await deployments.fixtures(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })
      })
