import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
  updateUserNfaStakingStakedBalance,
  updateNfaStakingUserBalance,
  updateUserNfaStakingPendingReward,
} from 'state/actions'
import { usePriceByPid, usePriceBananaBusd } from 'state/hooks'
import { unstake, sousUnstake, sousEmegencyWithdraw, nfaUnstake } from 'utils/callHelpers'
import track from 'utils/track'
import { CHAIN_ID } from 'config/constants'
import { useMasterchef, useNfaStakingChef, useSousChef } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const price = usePriceByPid(pid)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      const amountUsd = parseFloat(amount) * price.toNumber();
      dispatch(fetchFarmUserDataAsync(account))
      track({
        event: 'farm',
        chain: CHAIN_ID,
        data: {
          cat: 'unstake',
          amountUsd,
          pid,
        },
      })
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid, price],
  )

  return { onUnstake: handleUnstake }
}

// TODO remove legacy code we don't need to support
const SYRUPIDS = []

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const isOldSyrup = SYRUPIDS.includes(sousId)
  const price = usePriceBananaBusd();

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyWithdraw(sousChefContract, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      const amountUsd = parseFloat(amount) * price.toNumber();
      track({
        event: 'pool',
        chain: CHAIN_ID,
        data: {
          cat: 'unstake',
          amountUsd,
          pid: sousId,
        },
      })
    },
    [account, dispatch, isOldSyrup, masterChefContract, sousChefContract, sousId, price],
  )

  return { onUnstake: handleUnstake }
}

export const useSousEmergencyWithdraw = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const handleEmergencyWithdraw = useCallback(async () => {
    const txHash = await sousEmegencyWithdraw(sousChefContract, account)
    console.info(txHash)
    dispatch(updateUserStakedBalance(sousId, account))
    dispatch(updateUserBalance(sousId, account))
    dispatch(updateUserPendingReward(sousId, account))
  }, [account, dispatch, sousChefContract, sousId])
  return { onEmergencyWithdraw: handleEmergencyWithdraw }
}

export const useNfaUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const nfaStakeChefContract = useNfaStakingChef(sousId)

  const handleUnstake = useCallback(
    async (ids: number[]) => {
      await nfaUnstake(nfaStakeChefContract, ids, account)
      dispatch(updateUserNfaStakingStakedBalance(sousId, account))
      dispatch(updateNfaStakingUserBalance(sousId, account))
      dispatch(updateUserNfaStakingPendingReward(sousId, account))
      track({
        event: 'nfa',
        chain: CHAIN_ID,
        data: {
          cat: 'unstake',
          ids,
          pid: sousId,
        },
      })
    },
    [account, dispatch, nfaStakeChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
