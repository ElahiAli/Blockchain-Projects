const { network, getNamedAccounts, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { expect, assert } = require("chai");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace", function () {
          let basicNft, deployer;
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              basicNft = await ethers.getContract("BasicNft", deployer);
          });

          describe("constructor", function () {
              it("should init variables correctly", async () => {
                  const tokenId = await basicNft.getTokenCounter();
                  assert.equal(tokenId.toString(), "0");
              });
          });

          describe("mintNft", function () {
              it("emit an event after mint", async () => {
                  expect(await basicNft.mintNft()).to.emit(basicNft, "DogMinted");
              });

              it("token id must increase after mint", async () => {
                  await basicNft.mintNft();
                  const tokenId = await basicNft.getTokenCounter();
                  assert.equal(tokenId.toString(), "1");
              });
          });

          describe("tokenURI", function () {
              it("should revert it token doesn't exist", async () => {
                  await expect(basicNft.tokenURI(1)).to.be.revertedWith(
                      "ERC721Metadata: URI query for nonexistent token"
                  );
              });

              it("return token uri", async () => {
                  const expectedTokenURI =
                      "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
                  await basicNft.mintNft();
                  const tokenURI = await basicNft.tokenURI(0);
                  assert.equal(tokenURI, expectedTokenURI);
              });
          });
      });
