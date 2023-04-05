const { assert, expect } = require("chai");
const { network, deployments, getNamedAccounts, ethers } = require("hardhat");
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("ERC20 Unit Test", function () {
      const multiplier = 10 ** 18;
      let deployer, client;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        client = (await getNamedAccounts()).client;

        await deployments.fixture(["all"]);
        ourToken = await ethers.getContract("OurToken", deployer);
      });

      describe("constructor", function () {
        console.log(deployer);
        it("should have correct INTIAL_SUPLY of token", async () => {
          const total = await ourToken.totalSupply();
          assert.equal(total, INITIAL_SUPPLY);
        });
        it("should have correct name", async () => {
          const name = (await ourToken.name()).toString();
          assert.equal(name, "OurToken");
        });

        it("should have correct symbol", async () => {
          const symbol = (await ourToken.symbol()).toString();
          assert.equal(symbol, "OT");
        });
      });

      describe("transfer", function () {
        it("should transfer token successfully", async () => {
          const tokenAmount = ethers.utils.parseEther("10");
          await ourToken.transfer(client, tokenAmount);
          expect(await ourToken.balanceOf(client)).to.equal(tokenAmount);
        });
      });

      describe("allowances", function () {
        let anotherAddress;
        beforeEach(async function () {
          anotherAddress = await ethers.getContract("OurToken", client);
        });
        it("Should approve other address to spend token", async () => {
          const tokentAmount = await ethers.utils.parseEther("10");
          await ourToken.approve(client, tokentAmount);
          await anotherAddress.transferFrom(deployer, client, tokentAmount);
          expect(await anotherAddress.balanceOf(client)).to.be.equal(
            tokentAmount
          );
        });
      });
    });
