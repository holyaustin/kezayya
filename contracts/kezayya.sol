// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract FileNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private  _itemsShared;

    address owner;

    mapping(uint256 => StorageItem) private idToStorageItem;

    struct StorageItem {
      uint256 tokenId;
      address owner;
      address storageDrive;
      bool filePrivate;
      bool shared;
    }

    event StorageItemCreated (
      uint256 indexed tokenId,
      address owner,
      address storageDrive,
      bool filePrivate,
      bool shared
    );

    constructor() ERC721("Kezayya", "KEZAYYA") {
      owner = msg.sender;
    }

     /* Mints a File*/
    function createFile(string memory tokenURI, bool filePrivate) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createStorageItem(newTokenId, filePrivate);
      return newTokenId;
    }

    function createStorageItem(
      uint256 tokenId, bool filePrivate
    ) private {
      idToStorageItem[tokenId] =  StorageItem(
        tokenId,
        msg.sender,
        address(this),
        filePrivate,
        false
      );

       _transfer(msg.sender, address(this), tokenId);
      emit StorageItemCreated(
        tokenId,
        msg.sender,
        address(this),
        filePrivate,
        false
      );
    }

    // Transfers ownership of the item, as well as funds between parties 
    function createFileShare(
      uint256 tokenId
      ) public payable {

      idToStorageItem[tokenId].shared = true;
      _itemsShared.increment();
    }
    
    // Transfers ownership of the item, as well as funds between parties 
    function createFilePrivate(
      uint256 tokenId
      ) public payable {

      idToStorageItem[tokenId].filePrivate = true;
  
    }
    /* Returns all files on drive */
    function fetchAllStorageItems() public view returns (StorageItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint currentIndex = 0;

      StorageItem[] memory items = new StorageItem[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToStorageItem[i + 1].storageDrive == address(this)) {
          uint currentId = i + 1;
          StorageItem storage currentItem = idToStorageItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only all my files   */
    function fetchMyFiles() public view returns (StorageItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToStorageItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      StorageItem[] memory items = new StorageItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToStorageItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          StorageItem storage currentItem = idToStorageItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
  

    /* Returns only items a user has listed */
    function fetchMyPrivateFiles() public view returns (StorageItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToStorageItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      StorageItem[] memory items = new StorageItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToStorageItem[i + 1].owner == msg.sender && idToStorageItem[i + 1].filePrivate== true) {
          uint currentId = i + 1;
          StorageItem storage currentItem = idToStorageItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}