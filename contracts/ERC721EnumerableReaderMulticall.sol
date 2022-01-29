//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract ERC721EnumerableReaderMulticall {
    function idsOf(address[] calldata _owners, address[] calldata _tokens) external view returns (uint256[][] memory) {
        uint256[][] memory balances = new uint256[][](_owners.length * _tokens.length);

        for (uint256 i = 0; i < _owners.length; i++) {
            for (uint256 j = 0; j < _tokens.length; j++) {
                uint256 index = j + _tokens.length * i;
                /*
                 *     bytes4(keccak256('totalSupply()')) == 0x18160ddd
                 *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) == 0x2f745c59
                 *     bytes4(keccak256('tokenByIndex(uint256)')) == 0x4f6ccce7
                 *
                 *     => 0x18160ddd ^ 0x2f745c59 ^ 0x4f6ccce7 == 0x780e9d63
                 */
                if (IERC165(_tokens[j]).supportsInterface(0x780e9d63)) {
                    uint256 balance = IERC721Enumerable(_tokens[j]).balanceOf(_owners[i]);
                    balances[index] = new uint256[](balance);
                    for (uint256 k = 0; k < balance; k++) {
                        balances[index][k] = IERC721Enumerable(_tokens[j]).tokenOfOwnerByIndex(_owners[i], k);
                    }
                }
            }
        }

        return balances;
    }

    fallback() external payable {
        revert("This contract does not accept ethers");
    }
}
