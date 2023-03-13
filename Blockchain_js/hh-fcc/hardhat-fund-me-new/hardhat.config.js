require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-solhint");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.8",
	nameAccounts: {
		deployer: {
			default: 0,
		},
	},
};
