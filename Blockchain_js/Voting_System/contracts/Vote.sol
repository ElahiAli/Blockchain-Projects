// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

error Vote__NoteRegistered();
error Vote__FoodNotExists();
error Vote__AccessDenied();
error Vote__AlreadyVoted();

contract Vote is Ownable {
	uint256 public constant MINIMUM_AGE_OF_VOTERS = 9;

	struct Participants {
		string name;
		uint256 age;
		string election;
		bool vote;
	}

	//different options for vote
	string[] internal Options = ["Bad", "Notbad", "Good", "Awesome"];
	Participants[] internal registrationList;
	string[] internal foodElectionList;

	mapping(string => address) internal nameToAddress;
	mapping(string => mapping(string => uint256)) internal foodIndexToFoodVote;
	mapping(address => uint256) internal addressToIndex;

	modifier ageLimit(uint256 _age) {
		require(
			_age >= MINIMUM_AGE_OF_VOTERS,
			"your age is not enough for votign."
		);
		_;
	}

	modifier checkFoodExistent(string memory _election) {
		string[] memory newfoodElectionList = getElectionsList();
		bool found = false;
		for (uint256 index = 0; index < newfoodElectionList.length; index++) {
			if (
				keccak256(abi.encodePacked(_election)) ==
				keccak256(abi.encodePacked(newfoodElectionList[index]))
			) {
				found = true;
				break;
			}
		}
		if (!found) {
			revert Vote__FoodNotExists();
		}
		_;
	}

	// registration of all Participants
	function registration(
		string memory _name,
		uint256 _age,
		string memory _election
	) public ageLimit(_age) checkFoodExistent(_election) {
		registrationList.push(Participants(_name, _age, _election, false));
		nameToAddress[_name] = msg.sender;
		addressToIndex[msg.sender] = (registrationList.length) - 1;
	}

	//Election list by Owner
	function electionList(string[] calldata _foodName) public onlyOwner {
		for (uint256 i = 0; i < _foodName.length; i++) {
			foodElectionList.push(_foodName[i]);
		}
	}

	//Vote counting && voting anonymously
	function vote(
		string memory _name,
		uint256 _foodIndex,
		uint256 _statusIndex
	) public {
		if (
			keccak256(
				abi.encodePacked(
					registrationList[addressToIndex[msg.sender]].election
				)
			) != keccak256(abi.encodePacked(foodElectionList[_foodIndex]))
		) {
			revert Vote__AccessDenied();
		}
		if (registrationList[addressToIndex[msg.sender]].vote == true) {
			revert Vote__AlreadyVoted();
		} else {
			registrationList[addressToIndex[msg.sender]].vote = true;
		}

		string[] memory electionsList = getElectionsList();
		string[] memory options = getOptionsList();
		if (nameToAddress[_name] != msg.sender) {
			revert Vote__NoteRegistered();
		}
		foodIndexToFoodVote[electionsList[_foodIndex]][options[_statusIndex]]++;
	}

	//Results publishing
	function electionResult(
		string memory _foodName
	)
		public
		view
		returns (uint256 Bad, uint256 Notbad, uint256 Good, uint256 Awesome)
	{
		uint256 badVots = foodIndexToFoodVote[_foodName]["Bad"];
		uint256 notbadVots = foodIndexToFoodVote[_foodName]["Notbad"];
		uint256 GoodVots = foodIndexToFoodVote[_foodName]["Good"];
		uint256 awesomeVots = foodIndexToFoodVote[_foodName]["Awesome"];
		return (badVots, notbadVots, GoodVots, awesomeVots);
	}

	// showing different elections
	function getElectionsList() public view returns (string[] memory) {
		return foodElectionList;
	}

	// showing different options
	function getOptionsList() public view returns (string[] memory) {
		return Options;
	}

	//getting participantes
	function getParticipants() internal view returns (Participants[] memory) {
		return registrationList;
	}
}
