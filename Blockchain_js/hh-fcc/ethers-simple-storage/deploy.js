const ethers = require("ethers");
const fs = requir("fs");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:7545"
  );
  const wallet = new ethers.Wallet(
    "0x43bf92a843b0b35fc4fa3d3a175d211343b69e7f93ed0ec55ca55fb6d4d63651",
    provider
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
