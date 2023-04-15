// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

uint256 private s_tokenCounter;
uint256 private immutable i_lowImageURI;
uint256 private immutable i_highImageURI;
string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64";

contract dynamicNft is ERC721 {
  constructor(string memory lowSvg, string memory highSvg) ERC721("Dynamic Svg NFT", "DSN") {
    s_tokenCounter = 0;
  }
   
  // 1. our image is SVG so we turn it to base64
  // 2. need to remove it from base64
  // what abi.encodePacked() do?

  function svgToImageURI(string memory svg) public pure returns(string memory){
    string memory svgBase64Encoded = base64.encode(bytes(string(abi.encodePacked(svg))));
    // combining string together
    return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
  }

  function mintNft() public  {
    _safeMint(msg.sender,i_tokenCounter);
    s_tokenCounter += 1;
  }
}




/*
Advance Section:
-0.8.12+ :  string.cancat(stringA + stringB) making round two string.
-abi.encode: massive byte, use more gas.
-abi.encodePacked: very small byte, use less gas than e.ncode
-the result of byte() and abi.encodePacked() are equal.
-abi.decode(encoded things, (string,...,string)) -> decoding an encoded thing to string, it can decode multiple things.

-
function withdraw(address recentWinner) public {
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        require(success, "Transfer Failed");
    }

Remember this?
- In our {} we were able to pass specific fields of a transaction, like value. Data can be passed in {} like value.
- In our () we were able to pass data in order to call a specific function - but there was no function we wanted to call!
- We only sent ETH, so we didn't need to call a function!
- If we want to call a function, or send any data, we'd do it in these parathesis!
*/