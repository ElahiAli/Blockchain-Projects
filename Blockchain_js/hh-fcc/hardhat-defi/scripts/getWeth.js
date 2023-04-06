const { getNamedAccounts, ethers } = require("hardhat");
const AMOUNT = ethers.utils.parseEther("0.02");

async function getWeth() {
    const { deployer } = await getNamedAccounts();
    // call the deposit function on the weth contract : 1.Abi 2.Address

    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    );

    const tx = await iWeth.deposit({ value: AMOUNT });
    await tx.wait(1);
    const wethBalance = await iWeth.balanceOf(deployer);
    console.log(`Got ${wethBalance.toString()} Weth.`);
}

module.exports = { getWeth, AMOUNT };
