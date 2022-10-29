const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");

describe("FundMe", function() {
	let fundMe;
	let deployer;
	let mockv3Aggregator;
	let sendValue = ethers.utils.parseEther("1"); //1 Eth = 1000000000000000000
	beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer; //get accounts
		await deployments.fixture(["all"]); //get every tags in the deploys file
		fundMe = await ethers.getContract("FundMe", deployer); //last transaction that deployed.
		mockv3Aggregator = await ethers.getContract("MockV3Aggregator", deployer); //getting priceFeed from mock.
	});

	describe("constructor", () => {
		it("set the aggregator addresses correctly", async () => {
			const response = await fundMe.priceFeed();
			assert.equal(response, mockv3Aggregator.address);
		});

		describe("fund", () => {
			it("Fails if you don't send enough ETH!", async () => {
				await expect(fundMe.fund()).to.be.reverted;
			});

			it("updated the amount funded data structure", async () => {
				await fundMe.fund({ value: sendValue });
				const response = await fundMe.addressToAmountFunded(deployer);
				assert.equal(response.toString(), sendValue.toString());
			});

			it("Add funders to array of funders.", async () => {
				await fundMe.fund({ value: sendValue });
				const funder = await fundMe.funders(0);
				assert.equal(funder, deployer);
			});
		});
	});

	describe("withdraw", () => {
		beforeEach(async () => {
			await fundMe.fund({ value: sendValue });
		});

		it("withdraw ETH from a single founder", async () => {
			//Arrange
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);
			//Act
			const transactionResponse = await fundMe.withdraw();
			const transactionReceipt = await transactionResponse.wait(1);
			const { gasUsed, effectiveGasPrice } = transactionReceipt;
			const gasCost = gasUsed.mul(effectiveGasPrice);

			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

			//Assert
			assert.equal(endingFundMeBalance, 0);
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			);
		});
	});
});
