import { MenuEntry } from '@ape.swap/uikit'
import { ChainId } from '@ape.swap/sdk'
import { NETWORK_INFO_LINK } from 'config/constants/chains'
import { ContextApi } from '../../../contexts/Localization/types'

const tlosConfig: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Exchange'),
    lightIcon: 'ExchangeLightImage',
    darkIcon: 'ExchangeDarkImage',
    items: [
      {
        label: t('Swap'),
        href: '/swap',
        isNew: false,
      },
      {
        label: t('Liquidity'),
        href: '/liquidity',
        isNew: false,
      },
      {
        label: t('Pro Trading'),
        href: 'https://pro.apeswap.finance',
        isNew: false,
      },
    ],
  },
  {
    label: t('Farms'),
    href: '/jungle-farms',
    isNew: false,
  },
  {
    label: t('Explore'),
    lightIcon: 'MoreLightImage',
    darkIcon: 'MoreDarkImage',
    items: [
      {
        label: t('ApeStats'),
        href: '/apestats',
        isNew: false,
      },
      {
        label: t('Dashboard'),
        href: 'protocol-dashboard',
        isNew: true,
      },
      {
        label: t('Documentation'),
        href: 'https://apeswap.gitbook.io/apeswap-finance/',
        isNew: false,
      },
      {
        label: t('Charts'),
        href: NETWORK_INFO_LINK[ChainId.TLOS],
        isNew: false,
      },
      {
        label: t('Governance'),
        href: 'https://discuss.apeswap.finance',
        isNew: false,
      },
    ],
  },
]

export default tlosConfig
