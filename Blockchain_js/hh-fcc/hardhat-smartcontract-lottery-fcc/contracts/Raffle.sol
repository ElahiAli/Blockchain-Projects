//Lottery
//Enter the Lottery (paying some amount)
//Pick a random winner (verifiable random)
//Winner to be selected every x minutes -> completly automate
//Chainlink oracle -> Randomness, Automated Excution (Chainlink keeper)

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

error Raffle__NotEnoughETHEntered();

contract Lottery {
    /*State Variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players; //it's payable because the winner get payed.

    /* Events */
    event RaffleEnter(address indexed players);

    constructor(uint256 enteranceFee) {
        i_entranceFee = enteranceFee;
    }

    function enterRaffle() public payable {
        //check the entranceFee
        // require(msg.value > i_entranceFee,"not enough ETH")
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender)); //typecasted because it only accept payable address.
        emit RaffleEnter(msg.sender);
    }

    // function pickRandomWinner() {}

    //users can get entranceFee
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
