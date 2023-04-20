const { ethers, network } = require("hardhat");
const { moveBlock } = require("../utils/move-block");
const fs = require("fs");
const {
  NEW_STORE_VALUE,
  FUNCTION_CALL,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  PROPOSAL_FILE,
} = require("../helper-hardhat-config");

// We want to propose the box contract to change the value.

async function propose(functionToCall, args, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args); // encoded to bytes

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Description: \n ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposalReceipt = await proposeTx.wait(1);

  if (developmentChains.includes(network.name)) {
    moveBlock(VOTING_DELAY + 1);
  }

  const proposalId = proposalReceipt.events[0].args.proposalId;
  let proposal = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
  proposal[network.config.chainId.toString()].push(proposalId.toString());
  fs.writeFileSync(PROPOSAL_FILE, JSON.stringify(proposal));

  if (developmentChains.includes(network.name)) {
    await moveBlock(VOTING_DELAY + 1);
  }
}

propose(FUNCTION_CALL, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
