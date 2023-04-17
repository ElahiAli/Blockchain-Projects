const { getNamedAccounts, ethers, deployments } = require("hardhat");

// getting token URIs
async function main() {
  await deployments.fixture(["dynamicSvg", "mock"]);
  const { deployer } = await getNamedAccounts();

  console.log("Getting deployed contract...");
  const dynamicNft = await ethers.getContract("dynamicNft", deployer);
  console.log("interacting with mintNft function...");
  const highValue = ethers.utils.parseEther("4000");
  const dynamicNftMintTx = await dynamicNft.mintNft(highValue.toString());
  await dynamicNftMintTx.wait(1);
  const tokenUri = await dynamicNft.tokenURI(0);
  console.log(`Dynamic NFT has tokenURI: ${await tokenUri}`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
