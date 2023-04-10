const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata");

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

const FUND_AMOUNT = "1000000000000000000000";

let tokenUris = [
  "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
  "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
  "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
];

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //get the IPFS hashes of our images
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handelTokenUris();
  }

  let vrfCoordinatorV2Address, subscreaptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscreaptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscreaptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscreaptionId = networkConfig[chainId].subscreaptionId;
  }

  const args = [
    vrfCoordinatorV2Address,
    subscreaptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];

  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("RandomIpfsNft Deployed.");

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(randomIpfsNft.address, args);
  }
};

async function handelTokenUris() {
  tokenUris = [];
  // store the image in IPFS
  // store the metadata in IPFS
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation);
  for (imageUploadResponsesIndex in imageUploadResponses) {
    //create metadata
    //upload the metadata
    let tokenUrisMetadata = { ...metadataTemplate };
    tokenUrisMetadata.name = files[imageUploadResponsesIndex].replace(".png", "");
    tokenUrisMetadata.description = `An adorable ${tokenUrisMetadata.name} pup!`;
    tokenUrisMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUrisMetadata.name}...`);
    //upload the JSON to pinata / IPFS
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUrisMetadata);
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log("Token URIS Uploaded! They are:");
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
