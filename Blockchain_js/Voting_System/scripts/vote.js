const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
	const { deployer } = await getNamedAccounts();
	const vote = await ethers.getContract("Vote", deployer);

	console.log("entering food list");
	const transactionElectionList = await vote.electionList([
		"Hamburger",
		"Cheeseburger",
		"Sandwich",
	]);
	await transactionElectionList.wait(1);

	console.log("Registering...");
	const transactionRegister = await vote.registration("ali", 22, "Hamburger");
	await transactionRegister.wait(1);

	console.log("Voting...");
	const transactionResponse = await vote.vote("ali", 0, 0);
	await transactionResponse.wait(1);
	console.log("Voted!");

	console.log("result: ");
	const transactionResult = await vote.electionResult("Hamburger");
	console.log(
		`Bad= ${transactionResult.toString()[0]}`,
		`NotBad= ${transactionResult.toString()[2]}`,
		`Good= ${transactionResult.toString()[4]}`,
		`Awesome= ${transactionResult.toString()[6]}`
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
