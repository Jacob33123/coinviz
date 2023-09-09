import React, { useEffect, useState } from 'react'
import { ChartData, Coin, Exchange, SelectedPage } from '../types'
import { BallTriangle } from 'react-loader-spinner'
import { AutosizeChart } from './AutosizeChart'
import { ChartTooltip } from 'reaviz'
import { 
  formatBTC,
  formatUSD,
  getCoinChartData,
  getCoinImages,
  getCoinNames,
  getExchangeChartData,
  getExchangeImages,
  getExchangeNames,
  getRank,
} from '../utils'

type SelectedChartProps = {
  selectedPage: SelectedPage
  isLoading: boolean
  exchangeList: Exchange[]
  coinList: Coin[]
}

export const SelectedChart: React.FC<SelectedChartProps> = ({
  selectedPage,
  isLoading,
  exchangeList,
  coinList
}) => {
  const [coinChartData, setCoinChartData] = useState<ChartData>([])
  const [coinImages, setCoinImages] = useState<{[id: string]: string}>({})
  const [coinNames, setCoinNames] = useState<{[id: string]: string}>({})

  const [exchangeChartData, setExchangeChartData] = useState<ChartData>([])
  const [exchangeImages, setExchangeImages] = useState<{[id: string]: string}>({})
  const [exchangeNames, setExchangeNames] = useState<{[id: string]: string}>({})

  useEffect(() => {
    setCoinChartData(
      getCoinChartData(coinList)
    )

    setCoinImages(
      getCoinImages(coinList)
    )

    setCoinNames(
      getCoinNames(coinList)
    )
  }, [coinList])

  useEffect(() => {
    setExchangeChartData(
      getExchangeChartData(exchangeList)
    )

    setExchangeImages(
      getExchangeImages(exchangeList)
    )

    setExchangeNames(
      getExchangeNames(exchangeList)
    )
  }, [exchangeList])

  if (isLoading) {
    return <BallTriangle height={150} width={150} color='#07042e' wrapperStyle={{ margin: '200px' }} />
  } else {
    switch(selectedPage){
      case 'Exchanges':
        return (
          <AutosizeChart 
            chartData={exchangeChartData} 
            images={exchangeImages}
            tooltipComponent={
              <ChartTooltip
                content={(d: any) => (
                  <div className='tooltip'>
                    <div className="tooltip_pair">
                      {`#${getRank(d.x, exchangeChartData)} `}
                      {exchangeNames[d.x]}
                    </div>
                    <div className="tooltip_pair">{formatBTC(d.y)}</div>
                  </div>
                )}
              />
            }
          />
        )
      default:
        return (
          <AutosizeChart 
            chartData={coinChartData} 
            images={coinImages}
            tooltipComponent={
              <ChartTooltip
                content={(d: any) => (
                  <div className='tooltip'>
                    <div className="tooltip_pair">
                      {`#${getRank(d.x, coinChartData)} `}
                      {coinNames[d.x]}
                    </div>
                    <div className="tooltip_pair">{formatUSD(d.y)}</div>
                  </div>
                )}
              />
            }
          />
        )
      
    }
  }
}