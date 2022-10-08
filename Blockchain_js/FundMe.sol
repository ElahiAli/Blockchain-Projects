// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

contract FundMe{
    using PriceConverter for uint256; 

    uint256 public minimumUds = 50 * 1e18;
    //list of address.
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    function fund() public payable{
        //want to set a minimum amount to usd!
        //getConversionRate(msg.value) it change after using our own library. 
        require(msg.value.getConversionRate() > minimumUsd, "Didn't send enouph!");
        //taking the eth sender account's address.
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    
    // function withdraw(){}
}