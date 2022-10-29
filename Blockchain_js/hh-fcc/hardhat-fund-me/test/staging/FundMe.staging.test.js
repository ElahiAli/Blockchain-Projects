const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

developmentChains.include(network.name)
	? describe.skip
	: describe("FundMe", function() {
			let fundMe;
			let deployer;
			const sendValue = ethers.utils.parseEther("1");
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", deployer);
			});

			it("allow people to fund and withdraw", async () => {
				await fundMe.fund({ value: sendValue });
				await fundMe.withdraw();
				const endingFundMeBalance = await fundMe.provider.getBalance(
					fundMe.address
				);
				assert.equal(endingFundMeBalance.toString(), 0);
			});
	  });
