import React, { useCallback, useState } from 'react'
import { useModal } from '@apeswapfinance/uikit'
import DualLiquidityModal from '../components/DualAddLiquidity/DualLiquidityModal'
import { Field, selectCurrency } from '../state/swap/actions'
import { selectOutputCurrency } from '../state/zap/actions'
import { useDispatch } from 'react-redux'
import { ZapType } from '@ape.swap/sdk'

const useAddLiquidityModal = (zapIntoProductType?: ZapType) => {
  const [poolAddress, setPoolAddress] = useState('')
  const [pid, setPid] = useState('')
  const dispatch = useDispatch()
  const [onPresentAddLiquidityWidgetModal] = useModal(
    <DualLiquidityModal poolAddress={poolAddress} pid={pid} zapIntoProductType={zapIntoProductType} />,
    true,
    true,
    'dualLiquidityModal',
  )
  return useCallback(
    (token: string, quoteToken: string, poolAddress?: string, pid?: string, zapType = ZapType.ZAP) => {
      dispatch(
        selectCurrency({
          field: Field.INPUT,
          currencyId: token,
        }),
      )
      dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: quoteToken,
        }),
      )
      dispatch(
        selectOutputCurrency({
          currency1: token,
          currency2: quoteToken,
        }),
      )
      setPoolAddress(poolAddress)
      setPid(pid)
      onPresentAddLiquidityWidgetModal()
    },
    [dispatch, onPresentAddLiquidityWidgetModal],
  )
}

export default useAddLiquidityModal
