pragma solidity >=0.7.0 <0.9.0;
//SPDX-License-Identifier: UNLICENSED

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol'; 
//IERC 721
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol';
//IERC 721 reciever
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/IERC721Metadata.sol';
//IERC 721 metadata
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol';
//address
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol';
//context
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/introspection/ERC165.sol';
//ERC165


contract ERC721Token is IERC721,ERC165{
    //function balanceOf(address owner) external view returns (uint256 balance);
    using Address for address;
    
    
    string private _name; //name of nft

    string private _symbol;//symbol for nft

    mapping(uint256 => address) private _owners;//token id by owner address

    mapping(address => uint256) private _balances;//token count for an address

    mapping(uint256 => address) private _tokenApprovals;//token id with approved addresses

    mapping(address => mapping(address => bool)) private _operatorApprovals;//owner approvals


    constructor(string memory name, string memory symbol) { //set name and symbol of nft
        _name = name;
        _symbol = symbol;
    }

     function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");


        _balances[to] += 1;
        _owners[tokenId] = to;

    }

    function _burn(uint256 tokenId) internal virtual {
        address owner=_owners[tokenId];
        _balances[owner] -= 1;
        delete _owners[tokenId];

    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function balanceOf(address owner) public view virtual override returns (uint256) {
        return _balances[owner];
    }
    
    // function ownerOf(uint256 tokenId) external view returns (address owner);
    function ownerOf(uint256 tokenId)  public view virtual override returns (address){
        return _owners[tokenId];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId,"");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        address owner = _owners[tokenId];
        require(msg.sender == owner
         || isApprovedForAll(owner,msg.sender) 
         || getApproved(tokenId) == msg.sender, "ERC721: transfer caller is not owner nor approved");
        _owners[tokenId]=to;
        _balances[from]-=1;
        _balances[to]+=1;
        _data=_data;
        emit Transfer(from, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
       address owner=_owners[tokenId];
        require(msg.sender == owner
         || isApprovedForAll(owner,msg.sender) 
         || getApproved(tokenId) == msg.sender, "ERC721: transfer caller is not owner nor approved");
          _owners[tokenId]=to;
        _balances[from]-=1;
        _balances[to]+=1;
    }


    function approve(address to, uint256 tokenId) public virtual override {
        require(msg.sender== _owners[tokenId],"approval can only be made by owner");
        _tokenApprovals[tokenId] = to;
    }

      function setApprovalForAll(address operator, bool approved) public virtual override {
          _operatorApprovals[msg.sender][operator] = approved;
      }

      function getApproved(uint256 tokenId) public view virtual override returns (address) {
            return _tokenApprovals[tokenId];
      }


    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }


}