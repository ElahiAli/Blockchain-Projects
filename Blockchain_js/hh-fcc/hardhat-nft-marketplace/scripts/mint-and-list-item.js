const { ethers } = require("hardhat");

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract("BasicNft");
    const PRICE = ethers.utils.parseEther("0.01");

    console.log("Minting Nft...");
    const mintTx = await basicNft.mintNft();
    const mintReceipt = await mintTx.wait(1);
    const tokenId = mintReceipt.events[0].args.tokenId;
    console.log("Approving Nft...");
    const approveTx = await basicNft.approve(nftMarketplace.address, tokenId);
    await approveTx.wait(1);
    console.log("Listing NFT...");
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
    await tx.wait(1);
    console.log("NFT Listed!");
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
