const fs = require("fs");
const {
  PROPOSAL_FILE,
  developmentChains,
  VOTING_DELAY,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
const { moveBlock } = require("../utils/move-block");

const index = 0;

async function main(proposalIndex) {
  const proposal = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
  const proposalId = proposal[network.config.chainId][proposalIndex];

  if (developmentChains.includes(network.name)) {
    await moveBlock(VOTING_DELAY + 1);
  }

  // 0=Against, 1=For, 2=Abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "I like a do da cha cha.";
  const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
  await voteTxResponse.wait(1);
  console.log(`Proposal Statte: ${await governor.state(proposalId)}`);

  if (developmentChains.includes(network.name)) {
    await moveBlock(VOTING_PERIOD + 1);
  }
  console.log("Voting is over.");
  console.log(`Proposal State is: ${await governor.state(proposalId)}`);
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
