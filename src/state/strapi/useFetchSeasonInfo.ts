import { useEffect, useState } from 'react'
import { getSeasonInfo, TradingAllInfoDto, AddressStatsDto } from '../../hooks/api'

const useFetchSeasonInfo = ({ season, pair, address }: { season: number; pair: string; address: string }) => {
  const allInfoDto: TradingAllInfoDto = {}
  const [state, setState] = useState({
    allInfo: allInfoDto,
    loadingAllInfo: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allInfo = await getSeasonInfo({ season, pair, address })
        setState({
          allInfo,
          loadingAllInfo: false,
        })
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (pair) fetchData()
  }, [season, pair, address])

  return state
}

export default useFetchSeasonInfo