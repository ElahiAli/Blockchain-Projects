const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", function () {
          let raffle, vrfCoordinatorV2Mock;

          beforeEach(async () => {
              const { deployer } = await getNamedAccounts();
              await deployments.fixture(["all"]);
              raffle = await ethers.getContract("Raffle", deployer);
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
          });
      });
