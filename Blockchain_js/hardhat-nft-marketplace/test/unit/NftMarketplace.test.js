const { network, getNamedAccounts, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { expect, assert } = require("chai");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace", function () {
          let nftMarketplace, basicNft, deployer, player;
          const PRICE = ethers.utils.parseEther("0.01");
          const TOKEN_ID = 0;

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              const accounts = await ethers.getSigners();
              player = accounts[1];
              await deployments.fixture(["all"]);
              nftMarketplace = await ethers.getContract("NftMarketplace");
              basicNft = await ethers.getContract("BasicNft");
              await basicNft.mintNft();
              await basicNft.approve(nftMarketplace.address, TOKEN_ID);
          });

          describe("listItem", function () {
              it("emit an event after listing an item", async () => {
                  expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                      nftMarketplace,
                      "ItemList"
                  );
              });

              it("only owner can list the items", async () => {
                  await expect(
                      nftMarketplace.connect(player).listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner()");
              });

              it("should revert if price is less than  or equal to zero", async () => {
                  const price = ethers.utils.parseEther("0");
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, price)
                  ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero()");
              });

              it("should revert if nft is not approved for nftMarketplace", async () => {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID);

                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotApprovedForMarketplace()");
              });

              it("should return nft's owner and nft's price", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  const txResponse = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);

                  assert.equal(deployer, txResponse.seller);
                  assert.equal(PRICE, txResponse.price.toString());
              });

              it("a nft can be listed only one time", async () => {
                  nftMarketplace.once("ItemList", async () => {
                      await expect(
                          nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                      ).to.be.revertedWith(
                          `NftMarketplace__AlreadyListed(${basicNft.address},${TOKEN_ID})`
                      );
                  });
              });
          });
      });
