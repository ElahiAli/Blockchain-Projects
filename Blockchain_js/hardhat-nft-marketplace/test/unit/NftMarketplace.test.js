const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace", function () {
          let nftMarketplace, basicNft, deployer, client;
          const PRICE = ethers.utils.parseEther("0.01");
          const TOKEN_ID = 0;

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              client = (await getNamedAccounts()).client;
              nftMarketplace = await ethers.getContract("NftMarketplace");
              basicNft = await ethers.getContract("BasicNft");
              await basicNft.mintNft();
              await basicNft.approve(nftMarketplace.address, TOKEN_ID);
          });

          describe("listItem", function () {
              it("should list every nft", async () => {
                  const nftListed = await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  );
                  console.log(nftListed);
              });
          });
      });
