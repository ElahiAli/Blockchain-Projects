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
//     if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
//         await simpleStorage.deployTransaction.wait(6);
//         await verify(simpleStorage.address, []);
//     }
// }

// verifying contracts
// async function verify(contractAddress, args) {
//     console.log("Verifying contract...");
//     // *second perameter* ; try used because of await.
//     try {
//         await run("verify:verify", {
//             address: contractAddress,
//             constructorArguments: args,
//         });
//     } catch (e) {
//         if (e.message.toLowerCase().includes("already verified")) {
//             console.log("Already Verified!");
//         } else {
//             console.log(e);
//         }
//     }
// }

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
