const { network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config.js");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("DynamicSvgNft", function () {
      beforeEach(async function () {});

      describe("constructor", function () {});
    });
