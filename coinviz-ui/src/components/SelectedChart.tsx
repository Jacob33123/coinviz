import React from 'react'
import { Coin, Exchange, SelectedPage } from '../types'
import { BallTriangle } from 'react-loader-spinner'
import { AutosizeChart } from './AutosizeChart'
import { ChartTooltip } from 'reaviz'
import { 
  getCoinChartData,
  getCoinImages,
  getCoinNames,
  getExchangeChartData,
  getExchangeImages,
  getExchangeNames,
  getFormattedValue
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
  if (isLoading) {
    return <BallTriangle height={150} width={150} color='#07042e' wrapperStyle={{ margin: '200px' }} />
  } else {
    switch(selectedPage){
      case 'Exchanges':
        return (
          <AutosizeChart 
            chartData={exchangeList ? getExchangeChartData(exchangeList) : []} 
            images={exchangeList ? getExchangeImages(exchangeList): {}}
            tooltipComponent={
              <ChartTooltip
                content={(d: any) => (
                  <div className='tooltip'>
                    <div className="tooltip_pair">{getExchangeNames(exchangeList)[d.x]}</div>
                    <div className="tooltip_pair">{getFormattedValue(d.y)}</div>
                  </div>
                )}
              />
            }
          />
        )
      default:
        return (
          <AutosizeChart 
            chartData={coinList ? getCoinChartData(coinList) : []} 
            images={coinList ? getCoinImages(coinList): {}}
            tooltipComponent={
              <ChartTooltip
                content={(d: any) => (
                  <div className='tooltip'>
                    <div className="tooltip_pair">{getCoinNames(coinList)[d.x]}</div>
                    <div className="tooltip_pair">{getFormattedValue(d.y)}</div>
                  </div>
                )}
              />
            }
          />
        )
      
    }
  }
}