const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

describe("FundMe", async function () {
	let fundMe;
	let deployer;
	let mockV3Aggregator;
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
			await expect(fundMe.fund()).to.be.reverted();
		});
	});
});
