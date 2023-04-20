const fs = require("fs");
const { PROPOSAL_FILE, developmentChains, VOTING_DELAY } = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
const { moveBlock } = require("../utils/move-block");

const index = 0;

async function main(proposalIndex) {
  const proposal = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
  const proposalId = proposal[network.config.chainId][proposalIndex];

  // 0=Against, 1=For, 2=Abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "I like a do da cha cha.";
  const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlock(VOTING_DELAY + 1);
  }
  console.log("Voted! Ready to GO.");
  console.log(await governor.state(proposalId.toString()));
  if ((await governor.state(proposalId.toString())) === "4") {
    console.log("Proposal secceeded!");
  }
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
