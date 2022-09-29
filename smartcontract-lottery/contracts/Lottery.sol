pragma solidity ^0.6.6;

contract Lottery{
    adderss payable[] public players;

    function enter() public payable {
        players.push(msg.sender)
    };

    function getEntranceFee() public{};
    function startLottery() public{};
    function endLottery() public{};
}