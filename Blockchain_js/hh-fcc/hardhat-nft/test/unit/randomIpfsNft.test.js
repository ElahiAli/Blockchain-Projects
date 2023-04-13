const { network, deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomIpfsNft", function () {
      let deployer, randomIpfsNft, vrfCoordinatorV2Mock, client;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        client = await getNamedAccounts().client;
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

        it("emit an event with generating requestId", async () => {
          const fee = await randomIpfsNft.getMintFee();
          await expect(randomIpfsNft.requestNft({ value: fee.toString() })).to.emit(
            randomIpfsNft,
            "NftRequested"
          );
        });
      });

      describe("fulfillRandomWords", function () {
        let requestId;
        beforeEach(async function () {
          // call the requestNft function
          const mintFee = await randomIpfsNft.getMintFee();
          const requestNftResponse = await randomIpfsNft.requestNft({ value: mintFee });
          const requestNftReceipt = await requestNftResponse.wait(1);
          requestId = requestNftReceipt.events[1].args.requestId;
        });

        it("token counter should increase after mint", async () => {
          const intialState = await randomIpfsNft.getTokenCounter();
          await randomIpfsNft.once("NftMinted", async () => {
            const tokenId = await randomIpfsNft.getTokenCounter();
            assert.equal(tokenId.toString(), "1");
          });

          assert.equal(intialState, "0");
        });

        it("mint a nft and emit an event after getting random word", async () => {
          // mocking chainlink VRF
          await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
          const dogOwner = await randomIpfsNft.getRequestedIdToSender(requestId);
          assert.equal(dogOwner, deployer);
        });

        it("emit an event after minting nft", async () => {
          console.log(requestId.toString());
          expect(
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
          ).to.emit(randomIpfsNft, "NftMinted");
        });
      });

      describe("withdraw", function () {
        it("only owner can withdraw", async () => {
          // deposit money
          mintFee = await randomIpfsNft.getMintFee();
          await randomIpfsNft.requestNft({ value: mintFee });

          const startingBalanceDeployer = await randomIpfsNft.provider.getBalance(deployer);
          const startingBalanceNFT = await randomIpfsNft.provider.getBalance(randomIpfsNft.address);

          //withdraw money
          const txResponse = await randomIpfsNft.withdraw();
          const txReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingBalanceDeployer = await randomIpfsNft.provider.getBalance(deployer);
          const endingBalanceNFT = await randomIpfsNft.provider.getBalance(randomIpfsNft.address);

          assert.equal(endingBalanceNFT, "0");
          assert.equal(
            startingBalanceDeployer.add(startingBalanceNFT).toString(),
            endingBalanceDeployer.add(gasCost).toString()
          );
          await expect(randomIpfsNft.connect(client).withdraw()).to.be.reverted;
        });
      });

      describe("getBreedFromModdedRng", function () {
        it("should return pug if the chance is less than 10", async () => {
          const dogName = await randomIpfsNft.getBreedFromModdedRng(9);
          assert.equal("0", dogName);
        });

        it("should return shiba_Inu if the chance is less than 45 and grater than 10", async () => {
          const dogName = await randomIpfsNft.getBreedFromModdedRng(15);
          assert.equal("1", dogName);
        });

        it("should return st.bernard if the chance is grater than 45 and less than 99", async () => {
          const dogName = await randomIpfsNft.getBreedFromModdedRng(50);
          assert.equal("2", dogName);
        });

        it("should revert if the chance is grater than or equal to 100", async () => {
          await expect(randomIpfsNft.getBreedFromModdedRng(100)).to.be.revertedWith(
            "RandomIpfsNft__RangeOutOfBounds"
          );
        });
      });
    });
