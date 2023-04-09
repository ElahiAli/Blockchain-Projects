const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { storeImages } = require("../utils/uploadToPinata");

const imagesLocation = "./images/randomNft";
const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenUris;

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handelTokenUris();
  }

  log("-------------------------------------------------");
  let vrfCoordinatorV2Address, subscreaptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscreaptionId = txReceipt.events[0].args.subId;
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscreaptionId = networkConfig[chainId].subscreaptionId;
  }

  log("-------------------------------------------------------");
  await storeImages(imagesLocation);

  //   const args = [
  //     vrfCoordinatorV2Address,
  //     subscreaptionId,
  //     networkConfig[chainId].gasLane,
  //     networkConfig[chainId].callbackGasLimit,
  //     // tokenUris,
  //     networkConfig[chainId].mintFee,
  //   ];
};

async function handelTokenUris() {
  tokenUris = [];
  // store the image in IPFS
  // store the metadata in IPFS

  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
