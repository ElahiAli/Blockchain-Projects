// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

error Vote__NoteRegistered();

contract Vote is Ownable {
    uint256 public constant MINIMUM_AGE_OF_VOTERS = 9;

    struct Participants {
        string name;
        uint256 age;
        string election;
    }

    //different options for vote
    string[] internal Options = ["Bad", "Notbad", "Good", "Awesome"];
    Participants[] internal registrationList;
    string[] internal foodElectionList;

    mapping(string => address) public nameToAddress;
    mapping(string => mapping(string => uint256)) public foodIndexTOFoodVote;
    mapping(string => uint256) public statusToCount;

    modifier ageLimit(uint256 _age) {
        require(
            _age <= MINIMUM_AGE_OF_VOTERS,
            "your age is not enough for votign."
        );
        _;
    }

    // registration of all Participants
    function registration(
        string memory _name,
        uint256 _age,
        string memory _election
    ) public ageLimit(_age) {
        registrationList.push(Participants(_name, _age, _election));
        nameToAddress[_name] = msg.sender;
    }

    //Election list by Owner
    function electionList(string memory _foodName) public onlyOwner {
        foodElectionList.push(_foodName);
    }

    //voting anonymously
    //Vote counting
    function vote(
        string memory _name,
        uint256 _foodIndex,
        uint256 _statusIndex
    ) public {
        if (nameToAddress[_name] != msg.sender) {
            revert Vote__NoteRegistered();
        }
        uint256 count = statusToCount[_statusIndex];
        statusToCount[_statusIndex] = count + 1;
        foodIndexTOFoodVote[foodElectionList[_foodIndex]] = statusToCount;
    }

    //Results publishing

    // showing different elections
    function getElectionsList() public view returns (string[] memory) {
        return foodElectionList;
    }

    // showing different options
    function getOptionsList() public view returns (string[] memory) {
        return Options;
    }
}
