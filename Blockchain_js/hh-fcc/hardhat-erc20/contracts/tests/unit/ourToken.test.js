const { developmentChains, network } = require("hardhat");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("ERC20 Unit Test", function () {
      beforeEach(async function () {});

      describe("constructor", function () {});
    });
