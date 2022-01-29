const { use, expect } = require('chai')
const { ethers } = require('hardhat')
const { solidity } = require('ethereum-waffle')
use(solidity)

let erc721A, erc721B, reader, notStandard

const buildIdsArray = (_from, _to) => Array.from(Array(_to - _from + 1).keys()).map((_id) => _id + _from)

describe('ERC721EnumerableReaderMulticall', () => {
  beforeEach(async () => {
    const StandardEnumerable721Token = await ethers.getContractFactory('StandardEnumerable721Token')
    const ERC721EnumerableReaderMulticall = await ethers.getContractFactory('ERC721EnumerableReaderMulticall')
    const NotStandard721Token = await ethers.getContractFactory('NotStandard721Token')

    const accounts = await ethers.getSigners()
    owner = accounts[0]
    account1 = accounts[1]

    reader = await ERC721EnumerableReaderMulticall.deploy()
    erc721A = await StandardEnumerable721Token.deploy('TokenA', 'TKNA')
    erc721B = await StandardEnumerable721Token.deploy('TokenB', 'TKNB')
    notStandard = await NotStandard721Token.deploy('TokenN', 'TKNN')
  })

  it('should returns empty array when passing a not standard token - 1', async () => {
    await notStandard.mint(10, owner.address)
    const ids = await reader.idsOf([owner.address], [notStandard.address])
    expect(ids[0]).to.be.deep.eq([])
  })

  it('should read correctly the balances - 2', async () => {
    await erc721A.mint(10, owner.address)
    await notStandard.mint(10, owner.address)

    const ids = await reader.idsOf([owner.address], [erc721A.address, notStandard.address])
    const ownerIds = [ids[0].map((_id) => _id.toNumber()), ids[1]]

    // owner erc721A balances = [0...9]
    // owner erc721B balances = [] -> not standard
    expect(ownerIds[0]).to.be.deep.eq(buildIdsArray(0, 9))
    expect(ownerIds[1]).to.be.deep.eq([])
  })

  it('should read correctly the balances - 3', async () => {
    await erc721A.mint(10, owner.address)
    await erc721B.mint(20, owner.address)

    const ids = await reader.idsOf([owner.address], [erc721A.address, erc721B.address])
    const ownerIds = [ids[0].map((_id) => _id.toNumber()), ids[1].map((_id) => _id.toNumber())]

    // owner erc721A balances = [0...9]
    // owner erc721B balances = [0...19]
    expect(ownerIds[0]).to.be.deep.eq(buildIdsArray(0, 9))
    expect(ownerIds[1]).to.be.deep.eq(buildIdsArray(0, 19))
  })

  it('should read correctly the balances - 4', async () => {
    await erc721A.mint(10, owner.address)
    await erc721A.mint(10, account1.address)
    await erc721B.mint(20, owner.address)
    await erc721B.mint(120, account1.address)

    const ids = await reader.idsOf([owner.address, account1.address], [erc721A.address, erc721B.address])
    const ownerIds = [ids[0].map((_id) => _id.toNumber()), ids[1].map((_id) => _id.toNumber())]
    const account1Ids = [ids[2].map((_id) => _id.toNumber()), ids[3].map((_id) => _id.toNumber())]

    // owner erc721A balances = [0...9]
    // account1 erc721A balances = [10...19]
    // owner erc721B balances = [0...19]
    // account1 erc721B balances = [20...140]
    expect(ownerIds[0]).to.be.deep.eq(buildIdsArray(0, 9))
    expect(ownerIds[1]).to.be.deep.eq(buildIdsArray(0, 19))
    expect(account1Ids[0]).to.be.deep.eq(buildIdsArray(10, 19))
    expect(account1Ids[1]).to.be.deep.eq(buildIdsArray(20, 139))
  })

  it('should read correctly the balances - 5', async () => {
    await erc721A.mint(10, owner.address)
    await erc721A.mint(10, account1.address)
    await erc721B.mint(20, owner.address)
    await erc721B.mint(120, account1.address)
    await erc721A.mint(5, owner.address)
    await erc721A.mint(15, account1.address)

    await erc721B.mint(65, owner.address)
    await erc721B.mint(1, account1.address)

    const ids = await reader.idsOf([owner.address, account1.address], [erc721A.address, erc721B.address])
    const ownerIds = [ids[0].map((_id) => _id.toNumber()), ids[1].map((_id) => _id.toNumber())]
    const account1Ids = [ids[2].map((_id) => _id.toNumber()), ids[3].map((_id) => _id.toNumber())]

    // owner erc721A balances = [0...9, 20...24]
    // account1 erc721A balances = [10...19, 25...39]
    // owner erc721B balances = [0...19, 140...204]
    // account1 erc721B balances = [20...139, 205]
    expect(ownerIds[0]).to.be.deep.eq([...buildIdsArray(0, 9), ...buildIdsArray(20, 24)])
    expect(ownerIds[1]).to.be.deep.eq([...buildIdsArray(0, 19), ...buildIdsArray(140, 204)])
    expect(account1Ids[0]).to.be.deep.eq([...buildIdsArray(10, 19), ...buildIdsArray(25, 39)])
    expect(account1Ids[1]).to.be.deep.eq([...buildIdsArray(20, 139), 205])
  })
})
