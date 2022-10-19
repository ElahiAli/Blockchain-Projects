# Blockchain-Tutorial

## <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/SimpleStorage.sol'>SimpleStorage.sol:</a>

working with remix and compiling contracts.<br/>
store a favorit number and returning it.<br/>
store array with name and favorit number and returning the favorit number and ...

## <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/StorageFactory.sol'>StorageFactory.sol:</a>

storing transactions and show the address.<br/>
using SimpleStorage functions and learning how to <strong>intract with another contract</strong>.<br/>
we also used <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/ExtraStorage.sol'>inheritance</a> and override store fuction.<br/>

## <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/FundMe.sol'>FundMe.sol:</a>

transaction that can send money and the amount can't be less than 50$.<br/>
the money can be <strong>withdraw</strong> only by the owner of contract.<br/>
learning how to build our own <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/PriceConverter.sol'>library</a> and use it in our files.<br/>
we also import interface and getting the version and <strong>convert the currency</strong> and storing the funders.<br/>
using <strong>constructor</strong> that immediatly excute after contract excution.<br/>
get familiar with special functions like <a href='https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/FallbackExample.sol'>receive and fallback</a>
also get familiar with keyword like <strong>external</strong> and <strong>immutable</strong> and <strong>constant</strong> etc..

## <a href="https://github.com/ElahiAli/Blockchain-Tutorial/tree/master/Blockchain_js/hh-fcc/ethers-simple-storage">Ether.js:</a>:

### Installing ether:

`yarn add ether`

### Compile solidity file:

`yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol`

### Run deploy file:

`node deploy.js`

## <a href="https://github.com/ElahiAli/Blockchain-Tutorial/tree/master/Blockchain_js/hh-fcc/hardhat-simple-storage">SimpleStorage-hardhat:</a>

### Initial new project:

`yarn init`

### To use your local installation of Hardhat:

`yarn add --dev hardhat`

### Install Hardhat:

`yarn hardhat`

### Compiling your contracts:

`yarn hardhat compile`

### Deploying your contracts:

`yarn hardhat run scripts/deploy.js`

### <a href="https://github.com/ElahiAli/Blockchain-Tutorial/blob/master/Blockchain_js/hh-fcc/hardhat-simple-storage/README.md">Hardhat commands</a>
