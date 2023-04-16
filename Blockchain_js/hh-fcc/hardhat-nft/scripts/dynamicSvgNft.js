const { getNamedAccounts, ethers, deployments } = require("hardhat");

// getting token URIs
async function main() {
  await deployments.fixture(["all"]);
  const { deployer } = await getNamedAccounts();
  const dynamicNft = await ethers.getContract("dynamicNft", deployer);
  const mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);

  // console.log(mockV3Aggregator.address);

  const lowSvg = await dynamicNft.getLowSvg();
  const highSvg = await dynamicNft.getHighSvg();

  const highValue = await ethers.utils.parseEther("1000000000000");
  await dynamicNft.mintNft(highValue);
  const tokenUri = await dynamicNft.tokenURI(0);

  console.log(tokenUri);
  // console.log("lowSvg: ", lowSvg);
  // console.log("highSvg: ", highSvg);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
