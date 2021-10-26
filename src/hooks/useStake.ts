import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import track from 'utils/track'
import { CHAIN_ID } from 'config/constants'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateNfaStakingUserBalance,
  updateUserNfaStakingStakedBalance,
} from 'state/actions'
import { usePriceByPid, usePriceBananaBusd } from 'state/hooks'
import { stake, sousStake, sousStakeBnb, nfaStake } from 'utils/callHelpers'
import { useMasterchef, useNfaStakingChef, useSousChef } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const price = usePriceByPid(pid)

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      const amountUsd = parseFloat(amount) * price.toNumber();
      dispatch(fetchFarmUserDataAsync(account))
      track({
        event: 'farm',
        chain: CHAIN_ID,
        data: {
          cat: 'stake',
          amountUsd,
          pid,
        },
      })
    },
    [account, dispatch, masterChefContract, pid, price],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const price = usePriceBananaBusd();

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      const amountUsd = parseFloat(amount) * price.toNumber();
      track({
        event: 'pool',
        chain: CHAIN_ID,
        data: {
          cat: 'stake',
          amountUsd,
          pid: sousId,
        },
      })

      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, price],
  )

  return { onStake: handleStake }
}

export const useNfaStake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const nfaStakeChefContract = useNfaStakingChef(sousId)

  const handleStake = useCallback(
    async (ids: number[]) => {
      await nfaStake(nfaStakeChefContract, ids, account)
      dispatch(updateUserNfaStakingStakedBalance(sousId, account))
      dispatch(updateNfaStakingUserBalance(sousId, account))
      track({
        event: 'nfa',
        chain: CHAIN_ID,
        data: {
          cat: 'stake',
          ids,
          pid: sousId,
        },
      })
    },
    [account, dispatch, nfaStakeChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
