/** @jsxImportSource theme-ui */
import React from 'react'
import { Box, Switch } from 'theme-ui'
import ZapIcon from './Svg/ZapIcon'
import { CogIcon, Flex, Link, RunFiatButton, Svg, Text, useModal } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import track from 'utils/track'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MoonPayModal from 'views/Topup/MoonpayModal'
import SettingsModal from '../../Menu/GlobalSettings/SettingsModal'

interface ZapSwitchProps {
  handleZapSwitch?: () => void
  goZap?: boolean
}

const ZapSwitch: React.FC<ZapSwitchProps> = ({ handleZapSwitch, goZap }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const [onPresentModal] = useModal(<MoonPayModal />)
  const [onPresentSettingsModal] = useModal(<SettingsModal simplified />)

  return (
    <Flex sx={{ margin: '15px 0', justifyContent: 'space-between', alignItems: 'center' }}>
      <Flex>
        <Flex sx={{ marginRight: '5px', alignItems: 'center' }}>
          <ZapIcon fill="primary" />
        </Flex>
        <Text weight={700} size="16px" sx={{ marginRight: '10px', lineHeight: '18px' }}>
          {t('ZAP')}
        </Text>
        <Box sx={{ width: '50px' }}>
          <Switch
            onClick={handleZapSwitch}
            checked={goZap}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1EADA',
              height: '20px',
              width: '40px',
              '& div': {
                width: '15px',
                height: '15px',
                marginLeft: '4px',
              },
              'input:checked ~ &': {
                backgroundColor: 'yellow',
              },
            }}
          />
        </Box>
        <Link
          href="https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/liquidity"
          target="_blank"
          textAlign="center"
        >
          <Svg color={'grey' as any} icon="question" width="19px" />
        </Link>
      </Flex>

      <Flex>
        <RunFiatButton
          sx={{ marginRight: '2px', width: '24px' }}
          mini
          t={t}
          runFiat={onPresentModal}
          track={track}
          position="DEX"
          chainId={chainId}
        />
        <CogIcon sx={{ cursor: 'pointer' }} onClick={onPresentSettingsModal} width="24px" />
      </Flex>
    </Flex>
  )
}

export default React.memo(ZapSwitch)