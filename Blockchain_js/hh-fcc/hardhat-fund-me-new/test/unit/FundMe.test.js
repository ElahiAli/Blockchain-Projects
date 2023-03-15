const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

describe("FundMe", async function () {
	let fundMe;
	let deployer;
	let mockV3Aggregator;
	let sendValue = ethers.utils.parseEther("1");
	beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer;
		await deployments.fixture(["all"]);
		fundMe = await ethers.getContract("FundMe", deployer);
		mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
	});

	describe("constructor", async function () {
		it("sets the aggregator addresses correctly", async () => {
			const response = await fundMe.getPriceFeed();
			assert.equal(response, mockV3Aggregator.address);
		});
	});

	describe("fund", async function () {
		it("Fails if don't send enough Eth.", async () => {
			await expect(fundMe.fund()).to.be.reverted;
		});
		it("updated the amount funded data structure", async () => {
			await fundMe.fund({ value: sendValue });
			const response = await fundMe.getAddressToAmountFunded(deployer);
			assert.equal(response.toString(), sendValue.toString());
		});
		it("Adds funders to array of funders", async () => {
			await fundMe.fund({ value: sendValue });
			const funder = await fundMe.getFunder(0);
			assert.equal(funder, deployer);
		});
	});

	describe("withdraw", async function () {
		it("withdraw Eth from a single founder", async () => {
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);

			const transactionResponse = await fundMe.withdraw();
			const transactionReceipt = await transactionResponse.wait(1);
			const { gasUsed, effectiveGasPrice } = transactionReceipt;
			const gasCost = gasUsed.mul(effectiveGasPrice);

			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

			assert.equal(endingFundMeBalance, 0);
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			);
		});
		it("allows us to withdraw with multiple funders", async () => {
			const accounts = await ethers.getSigners();
			for (let i = 1; i < 6; i++) {
				const fundMeConnectedContract = await fundMe.connect(accounts[i]);
				await fundMeConnectedContract.fund({ value: sendValue });
			}
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);

			const transactionResponse = await fundMe.withdraw();
			const transactionReceipt = await transactionResponse.wait(1);
			const { gasUsed, effectiveGasPrice } = transactionReceipt;
			const gasCost = gasUsed.mul(effectiveGasPrice);

			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

			assert.equal(endingFundMeBalance, 0);
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			);

			await expect(fundMe.getFunder(0)).to.be.reverted;

			for (let i = 1; i < 6; i++) {
				assert.equal(
					await fundMe.getAddressToAmountFunded(accounts[i].address),
					0
				);
			}
		});
		it("only allows the owner to withdraw", async () => {
			const accounts = await ethers.getSigners();
			attacker = accounts[1];
			const attackerConnectedContract = await fundMe.connect(attacker);
			await expect(attackerConnectedContract.withdraw()).to.be.reverted;
		});
	});
});
