const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("basicNFT", function () {
      let deployer, basicNFT;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        basicNFT = await ethers.getContract("basicNFT", deployer);
      });

      describe("constructor", function () {
        it("Initializing variables", async () => {
          const name = await basicNFT.name();
          const symbol = await basicNFT.symbol();
          const tokenCounter = await basicNFT.getTokenCounter();
          assert.equal(tokenCounter.toString(), "0");
          assert.equal(name, "Dogie");
          assert.equal(symbol, "Dog");
        });
      });

      describe("mintNFT", function () {
        beforeEach(async function () {
          const txResponse = await basicNFT.mintNft();
          await txResponse.wait(1);
        });

        it("Allow users to mint an NFT, and update appropriately", async () => {
          const tokenURI = await basicNFT.tokenURI(0);
          const tokenCounter = await basicNFT.getTokenCounter();

          assert.equal(tokenCounter.toString(), "1");
          assert.equal(tokenURI, await basicNFT.TOKEN_URI());
        });

        it("balance of owner", async () => {
          const deployerBalance = await basicNFT.balanceOf(deployer);
          const owner = await basicNFT.ownerOf("0");

          assert.equal(deployerBalance.toString(), "1");
          assert.equal(owner, deployer);
        });
      });
    });
