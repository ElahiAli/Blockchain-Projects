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
              nftMarketplace = await ethers.getContract("NftMarketplace", deployer);
              basicNft = await ethers.getContract("BasicNft", deployer);
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

          describe("buyItem", function () {
              beforeEach(async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
              });
              it("should revert if price is less than determinded price", async () => {
                  const fee = ethers.utils.parseEther("0.001");
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: fee })
                  ).to.be.revertedWith(
                      `NftMarketplace__PriceNotMet("${basicNft.address}", ${TOKEN_ID}, ${PRICE})`
                  );
              });

              it("should revert if nft is not listed", async () => {
                  const addressZero = ethers.constants.AddressZero;
                  await expect(
                      nftMarketplace.buyItem(addressZero, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.be.revertedWith(`NftMarketplace__NotListed("${addressZero}", ${TOKEN_ID})`);
              });

              it("seller should receive nft's price", async () => {
                  const sellerBalanceBefore = await nftMarketplace.getProceeds(deployer);
                  await nftMarketplace.connect(player).buyItem(basicNft.address, TOKEN_ID, {
                      value: PRICE,
                  });
                  const sellerBalanceAfter = await nftMarketplace.getProceeds(deployer);

                  const listedItem = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
                  const nftdeployer = await nftMarketplace.getOwner(basicNft.address, TOKEN_ID);

                  assert.equal(sellerBalanceBefore.toString(), 0);
                  assert.equal(sellerBalanceAfter.toString(), "10000000000000000");
                  assert.equal(listedItem.seller, ethers.constants.AddressZero);
                  assert.equal(nftdeployer, player.address);
              });

              it("emit an event after buying a item", async () => {
                  expect(
                      await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.emit(nftMarketplace, "ItemBought");
              });
          });

          describe("cancelListing", function () {
              it("only owner can cancel a purchase", async () => {
                  await expect(
                      nftMarketplace.connect(player).cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotOwner()");
              });

              it("nft must be listed", async () => {
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(
                      `NftMarketplace__NotListed("${basicNft.address}", ${TOKEN_ID})`
                  );
              });

              it("item should be remove after cancelling", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
                  const listedItem = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);

                  assert.equal(listedItem.seller, ethers.constants.AddressZero);
                  assert.equal(listedItem.price.toString(), "0");
              });

              it("emit an event after cancelling", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit(
                      nftMarketplace,
                      "ItemCanceled"
                  );
              });
          });

          describe("updateListing", function () {
              it("only owner can update the nft'price ", async () => {
                  const newPrice = ethers.utils.parseEther("0.02");
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  await expect(
                      nftMarketplace
                          .connect(player)
                          .updateListing(basicNft.address, TOKEN_ID, newPrice)
                  ).to.be.revertedWith("NftMarketplace__NotOwner()");
              });

              it("nft must be listed", async () => {
                  const newPrice = ethers.utils.parseEther("0.02");
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
                  ).to.be.revertedWith(
                      `NftMarketplace__NotListed("${basicNft.address}", ${TOKEN_ID})`
                  );
              });

              it("price should be updated after updateListing", async () => {
                  const newPrice = ethers.utils.parseEther("0.02");
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice);

                  const expectedPrice = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);

                  assert.equal(expectedPrice.price.toString(), "20000000000000000");
              });

              it("emit an event after updating", async () => {
                  const newPrice = ethers.utils.parseEther("0.02");
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  expect(
                      await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
                  ).to.emit(nftMarketplace, "ItemListed");
              });
          });

          describe("withdrawProceeds", async function () {
              it("should revert if proceeds is 0", async () => {
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
                      "NftMarketplace__NotProceeds()"
                  );
              });

              it("proceed should be 0 after withdraw", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  await nftMarketplace
                      .connect(player)
                      .buyItem(basicNft.address, TOKEN_ID, { value: PRICE });
                  await nftMarketplace.withdrawProceeds();

                  const deployerProceeds = await nftMarketplace.getProceeds(deployer);

                  assert.equal(deployerProceeds.toString(), "0");
              });

              it("withdraw successfully", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
                  const sellerBalance = await nftMarketplace.getBalance(deployer);
                  await nftMarketplace
                      .connect(player)
                      .buyItem(basicNft.address, TOKEN_ID, { value: PRICE });

                  const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer);
                  const txResponse = await nftMarketplace.withdrawProceeds();
                  const txReceipt = await txResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = txReceipt;

                  const usedGas = gasUsed.mul(effectiveGasPrice);
                  const sellerBalanceAfter = await nftMarketplace.getBalance(deployer);

                  assert.equal(
                      sellerBalanceAfter.add(usedGas).toString(),
                      sellerBalance.add(deployerProceedsBefore).toString()
                  );
              });
          });
      });
