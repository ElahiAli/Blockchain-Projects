// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error RandomIpfsNft__RangeOutOfBounds();

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage {
  // when we mint an NFT, we will trigger a Chainlink VRF call to get us  a random number
  // using that number, we will get a random NFT

  // users have to pay to mint an NFT
  // the owner of the contract can withdraw the ETH

  //Type Declaration
  enum Breed {
    PUG,
    SHIBA_INU,
    ST_BERNARD
  }

  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
  uint64 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint16 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;

  //VRF Helper
  mapping(uint256 => address) s_requestIdToSender;

  //NFT Variables
  uint256 public s_tokenCounter;
  uint256 internal constant MAX_CHANCE_VALUE = 100;
  string[] internal s_dogTokenUris;

  constructor(
    address vrfCoordinatorV2,
    uint64 subscriptionId,
    bytes32 gasLane,
    uint16 callbackGasLimit,
    string[3] memory dogTokenUris
  ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN") {
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_subscriptionId = subscriptionId;
    i_gasLane = gasLane;
    i_callbackGasLimit = callbackGasLimit;
    s_dogTokenUris = dogTokenUris;
  }

  function requestNft(uint256 requestId) public {
    requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      i_callbackGasLimit,
      REQUEST_CONFIRMATIONS,
      NUM_WORDS
    );
    s_requestIdToSender[requestId] = msg.sender;
  }

  function fulfillRandomWord(uint256 requestId, uint256[] memory randoemWords) internal override {
    address dogOwner = s_requestIdToSender[requestId];
    uint256 newTokenId = s_tokenCounter;

    uint256 moddedRng = randoemWords[0] % MAX_CHANCE_VALUE;

    // 0 - 99
    // 7 - PUG
    // 12  shiba Inu
    // 88  st. bernard
    // 45  st. bernard

    Breed dogBreed = getBreedFromModdedRng(moddedRng);
    _safeMint(dogOwner, newTokenId);
    _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]);
  }

  function getChanceArray() public pure returns (uint256[3] memory) {
    return [10, 30, MAX_CHANCE_VALUE];
  }

  function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
    uint256 cumulativeSum = 0;
    uint256[3] memory chanceArray = getChanceArray();

    for (uint256 i = 0; i < chanceArray.length; i++) {
      if (moddedRng >= cumulativeSum && moddedRng < cumulativeSum + chanceArray[i]) {
        return Breed(i);
      }
      cumulativeSum += chanceArray[i];
    }
    revert RandomIpfsNft__RangeOutOfBounds();
  }

  function tokenURI(uint256) public view override returns (string memory) {}
}
