// upgrage manual way

const { ethers } = require("hardhat");

async function main() {
  const BoxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
  const transparentProxy = await ethers.getContract("Box_Proxy");

  const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address);
  const version1 = await proxyBoxV1.version();
  console.log(version1.toString());

  const boxV2 = await ethers.getContract("BoxV2");
  const upgrageTx = await BoxProxyAdmin.upgrade(transparentProxy.address, boxV2.address);
  await upgrageTx.wait(1);

  const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address);
  const version2 = await proxyBoxV2.version();
  console.log(version2.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
