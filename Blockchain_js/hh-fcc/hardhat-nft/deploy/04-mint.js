const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const chainId = network.config.chainId;

module.exports = async function ({ getNamedAccounts }) {
  const { deployer } = await getNamedAccounts();

  // BasicNft
  const basicNft = await ethers.getContract("basicNFT", deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
  console.log("------------------------------------------------------");
  console.log(`Basic Nft index 0 has tokenURI: ${await basicNft.tokenURI(0)}`);
  console.log("------------------------------------------------------");

  //Dynamic SVG NFT
  const dynamicNft = await ethers.getContract("dynamicNft", deployer);
  const highValue = ethers.utils.parseEther("4000");
  const dynamicNftMintTx = await dynamicNft.mintNft(highValue.toString());
  await dynamicNftMintTx.wait(1);
  console.log("------------------------------------------------------");
  console.log(`Dynamic SVG NFT index 0 has tokenURI: ${await dynamicNft.tokenURI(0)}`);
  console.log("------------------------------------------------------");

  // RandomIpfsNft
  //   const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  //   const mintFee = await randomIpfsNft.getMintFee();

  //   await new Promise(async (resolve, reject) => {
  //     // this is a listner
  //     setTimeout(() => reject("TimeOut: 'NFTMinted' event did not fired"), 300000);
  //     randomIpfsNft.once("NftMinted", async function () {
  //       console.log(
  //         `Random IPFS NFT index 0 has tokenURI: ${await randomIpfsNft.getDogTokenUris(0)}`
  //       );
  //       resolve();
  //     });

  //     // minting NFT
  //     const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() });
  //     const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
  //     if (developmentChains.includes(network.name)) {
  //       const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
  //       const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
  //       await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
  //     }
  //   });

  const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomIpfsNft.getMintFee();
  const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() });
  const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
  await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000); // 5 minute timeout time
    // setup listener for our event
    randomIpfsNft.once("NftMinted", async () => {
      console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.getDogTokenUris(0)}`);
      resolve();
    });
    if (chainId == 31337) {
      const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
      await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
    }
  });
};

module.exports.tags = ["all", "mint"];
