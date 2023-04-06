const { getNamedAccounts, ethers } = require("hardhat");
const { getWeth, AMOUNT } = require("./getWeth");

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();

    const lendingPool = await getLendingPool(deployer);
    console.log(`Lending Pool Address is : ${lendingPool.address}`);

    //deposit!
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    //-approve
    await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
    console.log("Depositing....");
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log("deposited.");

    //Borrow Time
    //how much we have borrowed?, how much we have in collateral, how much we can borrow
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, deployer);

    //-getting the price of Dai
    const daiPrice = await getDataPrice();
    //-converting the available borrow weth to dai -- the 0.95 is 95% of the amount that we borrowing we're  not getting all the fund just 95%
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
    console.log(`You can borrow ${amountDaiToBorrow} DAI`); // change to DAI
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString()); //change to wei

    //Borrow
    const diaTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    await borrowDia(diaTokenAddress, lendingPool, amountDaiToBorrowWei, deployer);

    //check the user after borrow
    await getBorrowUserData(lendingPool, deployer);

    //Repay
    await repay(amountDaiToBorrowWei, diaTokenAddress, lendingPool, deployer);
    await getBorrowUserData(lendingPool, deployer);
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveERC20(daiAddress, lendingPool.address, amount, account);
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
    await repayTx.wait(1);
    console.log("Repaid.");
}

async function borrowDia(daiAddress, lendingPool, amountDaiToBorrowWei, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrowWei, 1, 0, account);
    await borrowTx.wait(1);
    console.log("You've Borrowed!");
}

async function getDataPrice() {
    //reading don't need a signer(deployer)
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4" //DAI/ETH priceFeed Address
    );
    const price = (await daiEthPriceFeed.latestRoundData())[1]; //taking first index
    console.log(`The DAI/ETH price is ${price.toString()}`);
    return price;
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account);
    console.log(`You have ${totalCollateralETH} weth of ETH deposited.`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`);
    console.log(`You have ${availableBorrowsETH} worth of ETH.`);
    return { availableBorrowsETH, totalDebtETH };
}

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", //lendingpool Provider address : 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
        account
    );
    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account);
    return lendingPool;
}

async function approveERC20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account);
    const tx = await erc20Token.approve(spenderAddress, amountToSpend);
    await tx.wait(1);
    console.log("Approved!");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
