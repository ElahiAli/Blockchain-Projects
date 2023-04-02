const { expect, assert } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");

// const {}
developmentChains = ["hardhat", "localhost"];

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Vote Unit Test", function () {
			let txVote, deployer;
			beforeEach(async function () {
				deployer = (await getNamedAccounts()).deployer;
				// client = (await getNamedAccounts()).client;
				await deployments.fixture(["all"]);
				txVote = await ethers.getContract("Vote", deployer);

				const transactionElectionList = await txVote.electionList([
					"Hamburger",
					"Cheeseburger",
					"Sandwich",
				]);
				await transactionElectionList.wait(1);
			});

			describe("Registration", function () {
				it("revert if age under nine", async () => {
					await expect(txVote.registration("ali", 5, "Hamburger")).to.be
						.reverted;
				});

				it("revert if food name doesn't exist", async () => {
					await expect(txVote.registration("ali", 22, "water")).to.be.reverted;
				});

				it("registeration equal true", async () => {
					await txVote.registration("ali", 22, "Hamburger");
					const userIndex = await txVote.getAddressToIndex(deployer);
					const userDetail = await txVote.getUsersDetail(userIndex);

					assert.equal(userDetail.id, deployer);
				});
			});

			describe("electionList", function () {
				it("only owner can add food to the list", async () => {
					const [, client] = await ethers.getSigners();
					await expect(
						txVote.connect(client).electionList(["Hamburger", "water"])
					).to.be.reverted;
				});
			});

			describe("Vote", function () {
				let userIndex, userDetail;
				beforeEach(async function () {
					await txVote.registration("ali", 22, "Hamburger");
				});

				it("users should be registered before voting", async () => {
					const [, client] = await ethers.getSigners();
					await expect(txVote.connect(client).vote(0, 2)).to.be.reverted;
				});

				it("users can only vote for elections that they've been registered", async () => {
					userIndex = await txVote.getAddressToIndex(deployer);
					userDetail = await txVote.getUsersDetail(userIndex);
					await expect(txVote.vote(1, 2)).to.be.reverted;
				});

				it("each client can vote for just one time", async () => {
					await txVote.vote(0, 2);

					userIndex = await txVote.getAddressToIndex(deployer);
					userDetail = await txVote.getUsersDetail(userIndex);
					const clientVoted = userDetail.vote;

					await expect(txVote.vote(0, 2)).to.be.reverted;
					assert.equal(clientVoted, true);
				});
			});

			describe("electionResult", function () {
				it("return the result of election", async () => {
					await txVote.registration("ali", 22, "Hamburger");
					await txVote.vote(0, 2);

					const result = await txVote.getElectionResult("Hamburger");
					const goodStatusCount = result[3];
					const expectedValueOfVote = await txVote.getFoodIndexToFoodVote(0, 2);

					assert.equal(
						expectedValueOfVote.toString(),
						goodStatusCount.toString()
					);
				});
			});
	  });
