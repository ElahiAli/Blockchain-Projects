const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval;
          const chainId = network.config.chainId;

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              raffle = await ethers.getContract("Raffle", deployer);
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
              raffleEntranceFee = await raffle.getEntranceFee();
              interval = await raffle.getInterval();
          });

          describe("constructor", function () {
              it("Initializes the raffle correctly", async () => {
                  //Ideally we make our tests have just 1 assert per "it"
                  const raffleState = await raffle.getRaffleState(); //check the opening
                  assert.equal(raffleState.toString(), "0");
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
              });
          });

          describe("enterRaffle", function () {
              it("reverts when you don't pay enough", async () => {
                  await expect(raffle.enterRaffle()).to.be.reverted;
              });
              it("records players when they enter", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  const palyerFromContract = await raffle.getPlayer(0);
                  assert.equal(palyerFromContract, deployer);
              });
              // testing events.
              it("emits event on enter", async () => {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEnter"
                  );
              });
              it("doesn't allow entrance when raffle is calculating", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.request({ method: "evm_mine", params: [] });
                  // we pretend to be a keeper for a second
                  await raffle.performUpkeep([]); // changes the state to calculating for our comparison below
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.reverted;
              });
          });

          describe("checkUpkeep", function () {
              it("returns false if people haven't sent any ETH", async () => {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]); // sending a transaction
                  assert(!upkeepNeeded);
              });
              it("returns false if raffle isn't open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.send("evm_mine", []);
                  await raffle.performUpkeep([]);
                  const raffleState = await raffle.getRaffleState();
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                  assert.equal(raffleState.toString(), "1");
                  assert.equal(upkeepNeeded, false);
              });
              it("returns false if time hasn't passed", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x"); //callStatic?
                  assert(!upkeepNeeded);
              });
              it("returns true if enough time has passed, has players, eth, and is open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                  assert(upkeepNeeded);
              });
          });

          describe("performUpkeep", function () {
              it("it can only run if checkupkeep is true", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.send("evm_mine", []);
                  const tx = await raffle.performUpkeep([]);
                  assert(tx);
              });
              it("reverts when checkupkeep is false", async () => {
                  await expect(raffle.performUpkeep([])).to.be.reverted;
              });
              it("updates the raffle state and emits a requestId", async () => {
                  // Too many asserts in this test!
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.request({ method: "evm_mine", params: [] });
                  const txResponse = await raffle.performUpkeep([]); // emits requestId
                  const txReceipt = await txResponse.wait(1); // waits 1 block
                  //   console.log(txReceipt);
                  const requestId = txReceipt.events[1].args.requestId; //requestId == undefined ?
                  const raffleState = await raffle.getRaffleState(); // updates state

                  assert(requestId.toNumber() > 0);
                  assert(raffleState.toString() == "1"); // 0 = open, 1 = calculating
              });
          });

          describe("fulfillRandomWords", function () {
              beforeEach(async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                  await network.provider.send("evm_mine", []);
              });
              it("can only be called after performUpkeep", async () => {
                  await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be
                      .reverted;
                  await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)).to.be
                      .reverted;
              });
              it("picks a winner, resets the lottery, and sends money", async () => {
                  const additionalEntrants = 3;
                  const startingAccountsIndex = 1; //deployer has the index 0
                  const accounts = await ethers.getSigners();
                  for (
                      let i = startingAccountsIndex;
                      i < startingAccountsIndex + additionalEntrants;
                      i++
                  ) {
                      const accountConnectedRaffle = raffle.connect(accounts[i]);
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee });
                  }

                  const startingTimeStamp = await raffle.getLatestTimeStamp();

                  //performUpkeep (mock being Chainlink Keepers)
                  //fulfillRandomWords (mock being the Chainlink VRF)
                  //we will have to wait for the fulfillRandomWords to be called
                  await new Promise(async (resolve, reject) => {
                      raffle
                          .once("WinnerPicked", async () => {
                              console.log("Found the event!");
                              try {
                                  console.log(recentWinner);
                                  console.log(accounts[2].address);
                                  console.log(accounts[0].address);
                                  console.log(accounts[1].address);
                                  console.log(accounts[3].address);
                                  const recentWinner = await raffle.getRecentWinner();
                                  const raffleState = await raffle.getRaffleState();
                                  const endingTimeStamp = await raffle.getLatestTimeStamp();
                                  const numPlayers = await raffle.geNumberOfPlayers();
                                  const winnerEndingBalance = await accounts[1].getBalance();
                                  assert.equal(numPlayers.toString(), "0");
                                  assert.equal(raffleState.toString(), "0");
                                  assert(endingTimeStamp > startingTimeStamp);
                                  assert.equal(
                                      winnerStartingBalance.toString(),
                                      winnerEndingBalance.add(
                                          raffleEntranceFee
                                              .mul(additionalEntrants)
                                              .add(raffleEntranceFee)
                                              .toString()
                                      )
                                  );
                              } catch (e) {
                                  reject(e);
                              }
                              resolve();
                          })
                          .then(() => done());
                      //Setting up the listner
                      //below, we will fire the event, and the listner will pick it up, and resolve
                      const tx = await raffle.performUpkeep([]); // mocking the Chainlink performUpkeep
                      const txReceipt = await tx.wait(1);
                      const winnerStartingBalance = await accounts[1].getBalance();
                      // mocking Chainlink VRF
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          raffle.address
                      );
                  });
              });
          });
      });
