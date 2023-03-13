require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-solhint");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: "hardhat",
	solidity: {
		compilers: [{ version: "0.8.8" } || { version: "0.6.6" }],
	},
	nameAccounts: {
		deployer: {
			default: 0,
		},
	},
};
