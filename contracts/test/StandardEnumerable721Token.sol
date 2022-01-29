//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract StandardEnumerable721Token is ERC721Enumerable {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function mint(uint256 _amount, address _owner) external {
        uint256 totalSupply = totalSupply();
        for (uint256 tokenId = totalSupply; tokenId < totalSupply + _amount; tokenId++) {
            _mint(_owner, tokenId);
        }
    }
}
