// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
	//using library for specific type
	using PriceConverter for uint256;

	uint256 public constant MINIMUM_USD = 50 * 1e18;
	//list of address.
	address[] private s_funders;
	mapping(address => uint256) private s_addressToAmountFunded;

	address private immutable i_owner;
	AggregatorV3Interface public s_priceFeed;

	modifier onlyOwner() {
		// require(msg.sender == i_owner, "Sender is not the owner!");
		if (msg.sender != i_owner) {
			revert FundMe__NotOwner();
		}
		_;
	}

	constructor(address s_priceFeedAddress) {
		i_owner = msg.sender;
		s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
	}

	//if someone accedently send money or call the wrong function receive will call the fund function.
	receive() external payable {
		fund();
	}

	fallback() external payable {
		fund();
	}

	function fund() public payable {
		//want to set a minimum amount to usd!
		//getConversionRate(msg.value) it change after using our own library.
		require(
			msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD,
			"Didn't send enouph!"
		);
		//taking the eth sender account's address.
		s_funders.push(msg.sender);
		s_addressToAmountFunded[msg.sender] = msg.value;
	}

	function withdraw() public onlyOwner {
		/*starting index, ending index, step amount*/
		for (
			uint256 funderIndex = 0;
			funderIndex < s_funders.length;
			funderIndex++
		) {
			address funder = s_funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}

		//reset an Array, (0) is the count of object inside the array
		s_funders = new address[](0);

		//actualy withdraw the funds

		//1.transfer
		// msg.sender = address
		// payable(msg.sender) = payable address
		// payable(msg.sender).transfer(address(this).balance);

		//2.send
		// bool sendSuccess = payable(msg.sender).send(address(this).balance);
		// require(sendSuccess,"send failed!");

		//3.call /best way for now.
		(bool callSuccess, ) = payable(msg.sender).call{
			value: address(this).balance
		}("");
		require(callSuccess, "call failed!");
	}

	function cheaperWithdraw() public payable onlyOwner {
		address[] memory funders = s_funders;
		for (
			uint256 funderIndex = 0;
			funderIndex < funders.length;
			funderIndex++
		) {
			address funder = funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}

		s_funders = new address[](0);
		(bool success, ) = i_owner.call{value: address(this).balance}("");
		require(success);
	}

	function getOwner() public view returns (address) {
		return i_owner;
	}

	function getFunder(uint256 index) public view returns (address) {
		return s_funders[index];
	}

	function getAddressToAmountFunded(address funder)
		public
		view
		returns (uint256)
	{
		return s_addressToAmountFunded[funder];
	}

	function getPriceFeed() public view returns (AggregatorV3Interface) {
		return s_priceFeed;
	}
}
