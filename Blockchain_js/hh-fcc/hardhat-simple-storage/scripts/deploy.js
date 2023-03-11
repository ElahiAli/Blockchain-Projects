//ethers imported from hardhat it self.
const { ethers, run, network } = require("hardhat");

//async function
async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying contract...");
    const simpleStorage = await simpleStorageFactory.deploy();
    //for getting sure that it's deployed.
    await simpleStorage._deployed();

    console.log(`Deployed contract to: ${simpleStorage.address}`);

    //checking networks
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    // interacting with retrieve and store function
    const simpleStorageResponse = await simpleStorage.retrieve();
    console.log(`Current value: ${simpleStorageResponse}`);
    // uptading
    const transactionResponse = await simpleStorage.store(9);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated Value is: ${updatedValue}`);

    // interacting with addPerson function
    const addPersonResponse = await simpleStorage.addPerson("hamed", "9");
    await addPersonResponse.wait(1);
    const peopleIndex = await simpleStorage.people(0);
    console.log(`Name and FavoriteNumber : ${peopleIndex.toString()}`);

    // interacting with mapping(nameToFavoriteNumber)
    const nameTONumber = await simpleStorage.nameToFavoriteNumber("hamed");
    console.log(`Favorite Number: ${nameTONumber}`);
}

// verifying contracts
async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    // *second perameter* ; try used because of await.
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
