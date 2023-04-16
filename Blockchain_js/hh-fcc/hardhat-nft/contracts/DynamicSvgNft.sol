// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract dynamicNft is ERC721 {
  uint256 private s_tokenCounter;
  string private i_lowImageURI;
  string private i_highImageURI;
  string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64";
  AggregatorV3Interface internal immutable i_priceFeed;

  mapping(uint256 => int256) s_tokenIdToHighValue;

  event CreateNFT(uint256 indexed tokenId, int256 highValue);

  constructor(
    address priceFeedAddress,
    string memory lowSvg,
    string memory highSvg
  ) ERC721("Dynamic Svg NFT", "DSN") {
    s_tokenCounter = 0;
    i_lowImageURI = svgToImageURI(lowSvg);
    i_highImageURI = svgToImageURI(highSvg);
    i_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  // 1. our image is SVG so we turn it to base64
  // 2. need to remove it from base64
  // what abi.encodePacked() do?

  function svgToImageURI(string memory svg) public pure returns (string memory) {
    string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
    // combining string together
    return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
  }

  function mintNft(int256 highValue) public {
    s_tokenIdToHighValue[s_tokenCounter] = highValue;
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter += 1;
    emit CreateNFT(s_tokenCounter, highValue);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "data:application/json;base64";
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "URI Query for nonexistent token");
    // string memory imageURI = "hi";

    (, int256 price, , , ) = i_priceFeed.latestRoundData();
    string memory imageURI = i_lowImageURI;
    if (price >= s_tokenIdToHighValue[tokenId]) {
      imageURI = i_highImageURI;
    }

    return
      string(
        abi.encodePacked(
          _baseURI(),
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                name(),
                '", "description":"An NFT that changes based on the Chainlink Feed",',
                '"attributes":" [{"trait_type":"coolness","value":100}], "image":"',
                imageURI,
                ":}"
              )
            )
          )
        )
      );
  }

  function getLowSvg() public view returns (string memory) {
    return i_lowImageURI;
  }

  function getHighSvg() public view returns (string memory) {
    return i_highImageURI;
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return i_priceFeed;
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
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
