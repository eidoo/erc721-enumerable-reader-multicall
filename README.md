# erc721-enumerable-reader-multicall-reader-multicall


Simple contract to read all ids given a set of owner addresses and a set of token addresses for all `ERC721Enumerable` in a single call.
The contract can be deployed using CREATE2 in order to have the same address on all chains.

&nbsp;

***

&nbsp;

## :rocket: How to use it

```js
const web3 = new Web3(provider)
const contract = new web3.eth.Contract(
[
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_owners",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        }
      ],
      "name": "idsOf",
      "outputs": [
        {
          "internalType": "uint256[][]",
          "name": "",
          "type": "uint256[][]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
],
'address here'
)
const balances = await contract.methods.idsOf(_owners_, _tokens).call()
```

&nbsp;

***

&nbsp;

## :white_check_mark: Publish & Verify

Create an __.env__ file with the following fields:

```
MAINNET_PRIVATE_KEY=
ROPSTEN_PRIVATE_KEY=
ROSPTENT_NODE=
ETH_MAINNET_NODE=
ETHERSCAN_API_KEY=
BSC_MAINNET_NODE=
BSC_MAINNET_PRIVATE_KEY=
POLYGON_MAINNET_NODE=
POLYGON_MAINNET_PRIVATE_KEY=
FANTOM_MAINNET_NODE=
FANTOM_MAINNET_PRIVATE_KEY=
AVALANCHEC_MAINNET_NODE=
AVALANCHEC_MAINNET_PRIVATE_KEY=
```


### publish


```
❍ npx hardhat run --network mainnet scripts/deploy-script.js
```

### verify

```
❍ npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```
