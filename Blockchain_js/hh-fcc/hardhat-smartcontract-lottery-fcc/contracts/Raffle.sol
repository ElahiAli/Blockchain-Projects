//Lottery
//Enter the Lottery (paying some amount)
//Pick a random winner (verifiable random)
//Winner to be selected every x minutes -> completly automate
//Chainlink oracle -> Randomness, Automated Excution (Chainlink keeper)

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferFaild();

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /*State Variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players; //it's payable because the winner get payed.
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORD = 1;

    // Lottery Variable
    address private S_recentWinner;

    /* Events */
    event RaffleEnter(address indexed players);
    event RequestedRaffleWinner(uint256 indexed reqeustId);
    event WinnerPicked(address indexed winner);

    //without the VRFconsumerBaseV2, contract name(Raffle) would get an error. why?
    //vrfCoordinatorV2 is an address
    constructor(
        address vrfCoordinatorV2,
        uint256 enteranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = enteranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
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

    /**
     * @dev This is the function that Chainlink keeper nodes call
     * they look for the `upkeepNeeded` to return true
     * The following should be true in order to return true:
     */
    function checkUpkeep(
        bytes calldata /*checkData*/
    ) external override {}

    function requestRandomWinner() external {
        //it request uint256 id
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //keyHash
            i_subscriptionId, //subscriptionId that contract use for funding
            REQUEST_CONFIRMATIONS, //how many block should wait.
            i_callbackGasLimit, //how much gas to use for the callback request to contract's fulfillRandomWords()
            NUM_WORD //how many random number we gonna get.
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /*reequestId*/
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        S_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}(""); //send all the money in the contracts for winner.
        if (!success) {
            revert Raffle__TransferFaild();
        }
        emit WinnerPicked(recentWinner);
    }

    /* View / Pure functions */
    function getEntranceFee() public view returns (uint256) {
        //users can get entranceFee
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return S_recentWinner;
    }
}
