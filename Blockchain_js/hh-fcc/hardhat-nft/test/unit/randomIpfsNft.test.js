const { network, deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomIpfsNft", function () {
      let deployer, randomIpfsNft, vrfCoordinatorV2Mock;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["mock", "randomipfs"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
      });

      describe("constructor", function () {
        it("set starting value correctly.", async () => {
          const dogTokenUri = await randomIpfsNft.getDogTokenUris(0);
          const mintFee = await randomIpfsNft.getMintFee();
          const expectedMintFee = "10000000000000000";
          assert(dogTokenUri.includes("ipfs://"));
          assert.equal(mintFee, expectedMintFee);
        });
      });

      describe("requestNft", function () {
        it("should revert without payment", async () => {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            "RandomIpfsNft__NeedMoreEthSent"
          );
        });

        it("should revert if payment is less than expected", async () => {
          const fee = await ethers.utils.parseEther("0.0001");
          await expect(randomIpfsNft.requestNft({ value: fee })).to.be.revertedWith(
            "RandomIpfsNft__NeedMoreEthSent"
          );
        });

        // it("emit an event with generating requestId", async () => {
        //   const fee = await randomIpfsNft.getMintFee();
        //     await expect(randomIpfsNft.requestNft({ value: fee.toString() })).to.emit(
        //       randomIpfsNft,
        //       "NftRequested"
        //     );
        // });
      });

      describe("fulfillRandomWords", function () {});
    });
