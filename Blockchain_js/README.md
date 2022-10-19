## Blockchain-Tutorial

### <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/SimpleStorage.sol'>SimpleStorage.sol:</a>

working with remix and compiling contracts.<br/>
store a favorit number and returning it.<br/>
store array with name and favorit number and returning the favorit number and ...

### <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/StorageFactory.sol'>StorageFactory.sol:</a>

storing transactions and show the address.<br/>
using SimpleStorage functions and learning how to <strong>intract with another contract</strong>.<br/>
we also used <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/ExtraStorage.sol'>inheritance</a> and override store fuction.<br/>

### <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/FundMe.sol'>FundMe.sol:</a>

transaction that can send money and the amount can't be less than 50$.<br/>
the money can be <strong>withdraw</strong> only by the owner of contract.<br/>
learning how to build our own <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/PriceConverter.sol'>library</a> and use it in our files.<br/>
we also import interface and getting the version and <strong>convert the currency</strong> and storing the funders.<br/>
using <strong>constructor</strong> that immediatly excute after contract excution.<br/>
get familiar with special functions like <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/FallbackExample.sol'>receive and fallback</a>
also get familiar with keyword like <strong>external</strong> and <strong>immutable</strong> and <strong>constant</strong> etc..

### <a href="https://github.com/ElahiAli/Blockchain-Tutorial/tree/master/Blockchain_js/hh-fcc/ethers-simple-storage">Ether.js:</a>:

learn how to deploy a contract with javascript.<br/>
for deploying a contract we need two things:<br/>
1.ABI.<br/>
2.Bynary.<br/>
we can add a lot of override to the deploy function, override like: gasLimit,gasPrice,...<br/>
learn how to write scripts for long commands and make it shorter.<br/>
start working with <strong>testnet(Goerli)</strong> and deploying contract with it.<br/>
we get familiar with different RPC Urls like Alchemy, Infura, Quicknode...<br/>
iteracting with contracts in SimpleStorage.sol file.<br/>

### <a href="https://github.com/ElahiAli/Blockchain-Tutorial/tree/master/Blockchain_js/hh-fcc/hardhat-simple-storage">SimpleStorage-hardhat:</a>
Hardhat is a development environment that helps developers in testing, compiling, deploying, and debugging dApps on the Ethereum blockchain.<br/>
in this simple project I learned how to compile and deploy with hardhat.<br/>
*for run the project in hardhat default network*: `yarn hardhat run scripts/deploy.js`<br/>
I get familiar with writting Tasks in hardhat.config.js or in other ways.<br/>
like before I try some iteraction with other functions like addPerson.<br/>
learn to verify transaction in etherscan and in the code.<br/>
working with more networks like localhost(node),*we can run the node with this command*: `yarn hardhat node` <br/>
for using different networks in hardhat we need to add the **network's url and PrivateKey** to hardhat.config.js file
