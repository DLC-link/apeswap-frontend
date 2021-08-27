import burningPoolsConfig from 'config/constants/burningPools'
import sousChefABI from 'config/abi/sousChef.json'
import bananaABI from 'config/abi/banana.json'
import wbnbABI from 'config/abi/weth.json'
import { QuoteToken } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getWbnbAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchBurningPoolsBlockLimits = async () => {
  const poolsWithEnd = burningPoolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress[CHAIN_ID],
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress[CHAIN_ID],
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)

  return poolsWithEnd.map((bananaPoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: bananaPoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: bananaPoolConfig.bonusEndBlock || new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchBurningPoolsTotalStatking = async () => {
  const nonBnbPools = burningPoolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.BNB)
  const bnbPool = burningPoolsConfig.filter((p) => p.stakingTokenName === QuoteToken.BNB)

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    if (poolConfig.reflect || poolConfig.stakingTokenName === 'GNANA') {
      return {
        address: poolConfig.contractAddress[CHAIN_ID],
        name: 'totalStaked',
      }
    }
    return {
      address: poolConfig.stakingTokenAddress[CHAIN_ID],
      name: 'balanceOf',
      params: [poolConfig.contractAddress[CHAIN_ID]],
    }
  })

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [poolConfig.contractAddress[CHAIN_ID]],
    }
  })

  const nonBnbPoolsTotalStaked = await multicall(bananaABI, callsNonBnbPools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}