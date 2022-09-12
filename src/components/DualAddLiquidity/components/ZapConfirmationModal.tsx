/** @jsxImportSource theme-ui */
import { Modal } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import {
  ConfirmationPendingContent,
  TransactionErrorContent,
  TransactionSubmittedContent,
} from 'components/TransactionConfirmationModal'
import { Field } from '../../../state/zap/actions'
import { ChainId, Currency } from '@ape.swap/sdk'
import { ParsedFarm } from '../../../state/zap/reducer'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useTranslation } from '../../../contexts/Localization'

export interface ZapConfirmationModalProps {
  title?: string
  onDismiss?: () => void
  txHash?: string
  currencies?: { [Field.INPUT]?: Currency; [Field.OUTPUT]?: ParsedFarm }
  zap: any
  zapErrorMessage?: string
}

const modalProps = {
  sx: {
    zIndex: 12,
    overflowY: 'auto',
    maxHeight: 'calc(100% - 30px)',
    minWidth: ['90%', '420px'],
    width: '200px',
    maxWidth: '425px',
  },
}

const ZapConfirmationModal: React.FC<ZapConfirmationModalProps> = ({
  currencies,
  zap,
  title,
  onDismiss,
  txHash,
  zapErrorMessage,
}) => {
  const { currencyIn, pairOut } = zap
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const currencyInputSymbol =
    currencyIn?.currency?.symbol === 'ETH' ? (chainId === ChainId.BSC ? 'BNB' : 'MATIC') : currencyIn?.currency?.symbol

  const pendingText = `Zapping ${getBalanceNumber(
    currencyIn?.inputAmount?.toString(),
  )} ${currencyInputSymbol} into ${pairOut?.liquidityMinted?.toSignificant(4)} ${currencies?.OUTPUT?.lpSymbol} LP`
  return (
    <Modal title={title} {...modalProps} onDismiss={onDismiss}>
      {zapErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={
            zapErrorMessage.includes('INSUFFICIENT')
              ? t('Slippage Error: Please check your slippage & try again!')
              : zapErrorMessage
          }
        />
      ) : !txHash ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          onDismiss={onDismiss}
          LpToAdd={currencies[Field.OUTPUT]}
        />
      )}
    </Modal>
  )
}

export default React.memo(ZapConfirmationModal)