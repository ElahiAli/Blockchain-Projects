// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe{
    //using library for specific type
    using PriceConverter for uint256; 

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //list of address.
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    constructor(){
        i_owner =  msg.sender;
    }

    function fund() public payable{
        //want to set a minimum amount to usd!
        //getConversionRate(msg.value) it change after using our own library. 
        require(msg.value.getConversionRate() > MINIMUM_USD, "Didn't send enouph!");
        //taking the eth sender account's address.
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    
    function withdraw() public onlyOwner {
        /*starting index, ending index, step amount*/
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //reset an Array, (0) is the count of object inside the array
        funders = new address[](0); 

        //actualy withdraw the funds
        
        //1.transfer
        // msg.sender = address
        // payable(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance);

        //2.send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess,"send failed!");
        
        //3.call /best way for now.
        (bool callSuccess,) = payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess,"call failed!");
    }

    modifier onlyOwner {
        // require(msg.sender == i_owner, "Sender is not the owner!");
        if(msg.sender != i_owner) {revert NotOwner(); }
        _;
    }

        // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()
    
    //if someone accedently send money or call the wrong function receive will call the fund function.
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}