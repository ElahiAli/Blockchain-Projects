// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

//importing interface
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

//checking for overflow
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";

contract FundMe {
    //every uint256 would be check.
    using SafeMathChainlink for uint256;
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    //the address of contract's owner
    address public owner;

    //excute immediatly after contract.
    constructor() public {
        owner = msg.sender;
    }

    function fund() public payable {
        uint256 minimumUSD = 50 * 10**18;
        //checking the value is 50 doller or not.
        require(
            getConversionRate(msg.value) >= minimumUSD,
            "you need to spend more ETH!"
        );
        // msg.sender and msg.value are keywords in every contract call and transaction
        addressToAmountFunded[msg.sender] += msg.value;
        //array of funders.
        funders.push(msg.sender);
    }

    //getting version of interface
    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        return priceFeed.version();
    }

    function getPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        //because of unused local variable
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000);
    }

    //1000000000 => 1 Gwei
    function getConversionRate(uint256 ethAmount) public viewreturns(uint256) {
        uint256 ethPrice = getPrice();
        //devide because of editional 10 raised to 18 track on them. wei
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        return ethAmountInUsd;
    }

    //execute in withdraw before anything.
    modifier onlyowner() {
        require(msg.sender == owner);
        _;
    }

    function withdraw() public payable onlyowner {
        //transfer function send some amount of ethereum to whoever it's call.
        //this is keyword in solidity and refere to the contract that we're in.here we calling the address of contract.
        //taking back all the money.
        msg.sender.transfer(address(this).balance);
        //after withdraw the value of funder will be 0
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        //resetting funders array.
        funders = new address[](0);
    }
}
