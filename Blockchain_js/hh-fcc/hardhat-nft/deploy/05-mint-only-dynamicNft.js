const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const chainId = network.config.chainId;

module.exports = async function ({ getNamedAccounts }) {
  const { deployer } = await getNamedAccounts();

  //Dynamic SVG NFT
  console.log("Deploying Dynamic Nft...");
  const dynamicNft = await ethers.getContract("dynamicNft", deployer);
  const highValue = ethers.utils.parseEther("4000");
  const dynamicNftMintTx = await dynamicNft.mintNft(highValue.toString());
  await dynamicNftMintTx.wait(1);
  console.log("------------------------------------------------------");
  console.log(`Dynamic SVG NFT index 0 has tokenURI: ${await dynamicNft.tokenURI(0)}`);
  console.log("------------------------------------------------------");
};

module.exports.tags = ["all", "dynamicSvgNft", "mintDynamic"];

// 0x28E9FBe8D14E9Ffd99cF0a72A0B8D710c4e8F1f1   open sea
