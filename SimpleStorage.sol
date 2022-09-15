// SPDX-License-Identifier: MIT
// program version need to be define.
pragma solidity ^0.6.0;

contract SimpleStorage {
    //this will initialized to 0!
    //adding public make it visible.
    uint256 favoriteNumber;

    // is a type of array for storing objects , strings , ....
    struct People {
        uint256 favoriteNumber;
        string name;
    }
    //People is empty array and people is the name of array.
    People[] public people;

    //give name and get favoritNumber
    mapping(string => uint256) public nameToFavoriteNumber;

    //define value inside the functions and make change.
    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    //inside the function is empty so we "returns" a value type and not make change only reading.
    function retrive() public view returns (uint256) {
        return favoriteNumber;
    }

    //People have index in it.favoritNumber is in index 0 and name is in index 1.
    function addperson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
