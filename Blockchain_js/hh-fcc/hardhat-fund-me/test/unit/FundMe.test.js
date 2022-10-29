const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe", function() {
			let fundMe;
			let deployer;
			let mockv3Aggregator;
			let sendValue = ethers.utils.parseEther("1"); //1 Eth = 1000000000000000000
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer; //get accounts
				await deployments.fixture(["all"]); //get every tags in the deploys file
				fundMe = await ethers.getContract("FundMe", deployer); //last transaction that deployed.
				mockv3Aggregator = await ethers.getContract(
					"MockV3Aggregator",
					deployer
				); //getting getPriceFeed from mock.
			});

			describe("constructor", () => {
				it("set the aggregator addresses correctly", async () => {
					const response = await fundMe.getPriceFeed();
					assert.equal(response, mockv3Aggregator.address);
				});

				describe("fund", () => {
					it("Fails if you don't send enough ETH!", async () => {
						await expect(fundMe.fund()).to.be.reverted;
					});

					it("updated the amount funded data structure", async () => {
						await fundMe.fund({ value: sendValue });
						const response = await fundMe.getAddressToAmountFunded(deployer);
						assert.equal(response.toString(), sendValue.toString());
					});

					it("Add getFunder to array of getFunder.", async () => {
						await fundMe.fund({ value: sendValue });
						const funder = await fundMe.getFunder(0);
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
					const endingDeployerBalance = await fundMe.provider.getBalance(
						deployer
					);

					//Assert
					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance.add(startingDeployerBalance).toString(),
						endingDeployerBalance.add(gasCost).toString()
					);
				});

				it("allows us to withdraw multiple getFunder", async () => {
					//Arrange

					const accounts = await ethers.getSigners();
					for (let i = 1; i < 6; i++) {
						const fundMeConectedContract = await fundMe.connect(accounts[i]);
						await fundMeConectedContract.fund({ value: sendValue });
					}
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

					//Assert
					const endingFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const endingDeployerBalance = await fundMe.provider.getBalance(
						deployer
					);

					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance.add(startingDeployerBalance).toString(),
						endingDeployerBalance.add(gasCost).toString()
					);

					//make sure that the getFunder are reset properly
					await expect(fundMe.getFunder(0)).to.be.reverted;

					for (i = 0; i < 6; i++) {
						assert.equal(
							await fundMe.getAddressToAmountFunded(accounts[i].address),
							0
						);
					}
				});

				it("cheaper Withdraw testing", async () => {
					//Arrange

					const accounts = await ethers.getSigners();
					for (let i = 1; i < 6; i++) {
						const fundMeConectedContract = await fundMe.connect(accounts[i]);
						await fundMeConectedContract.fund({ value: sendValue });
					}
					const startingFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const startingDeployerBalance = await fundMe.provider.getBalance(
						deployer
					);

					//Act
					const transactionResponse = await fundMe.cheaperWithdraw();
					const transactionReceipt = await transactionResponse.wait(1);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					//Assert
					const endingFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const endingDeployerBalance = await fundMe.provider.getBalance(
						deployer
					);

					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance.add(startingDeployerBalance).toString(),
						endingDeployerBalance.add(gasCost).toString()
					);

					//make sure that the getFunder are reset properly
					await expect(fundMe.getFunder(0)).to.be.reverted;

					for (i = 0; i < 6; i++) {
						assert.equal(
							await fundMe.getAddressToAmountFunded(accounts[i].address),
							0
						);
					}
				});

				it("cheaper withdraw ETH from a single founder", async () => {
					//Arrange
					const startingFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const startingDeployerBalance = await fundMe.provider.getBalance(
						deployer
					);
					//Act
					const transactionResponse = await fundMe.cheaperWithdraw();
					const transactionReceipt = await transactionResponse.wait(1);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const endingFundMeBalance = await fundMe.provider.getBalance(
						fundMe.address
					);
					const endingDeployerBalance = await fundMe.provider.getBalance(
						deployer
					);

					//Assert
					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance.add(startingDeployerBalance).toString(),
						endingDeployerBalance.add(gasCost).toString()
					);
				});

				it("only allow the owner to withdraw", async () => {
					const accounts = await ethers.getSigners();
					const attackerConnectedContract = await fundMe.connect(accounts[1]);
					await expect(attackerConnectedContract.withdraw()).to.be.reverted;
				});
			});
	  });
