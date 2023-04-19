// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
  uint256 private value;

  event valueChanged(uint256 newValue);

  function store(uint256 _value) public onlyOwner {
    value = _value;
    emit valueChanged(_value);
  }

  function retrieve() public view returns (uint256) {
    return value;
  }
}
