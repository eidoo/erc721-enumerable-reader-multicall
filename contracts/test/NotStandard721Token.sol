//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NotStandard721Token is ERC721 {
    uint256 public totalSupply;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function mint(uint256 _amount, address _owner) external {
        uint256 _totalSupply = totalSupply;

        for (uint256 tokenId = _totalSupply; tokenId < _totalSupply + _amount; tokenId++) {
            _mint(_owner, tokenId);
            totalSupply = totalSupply + 1;
        }
    }
}
