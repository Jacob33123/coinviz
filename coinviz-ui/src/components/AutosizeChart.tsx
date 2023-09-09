import { max, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Bubble, BubbleChart, BubbleLabel, BubbleSeries, ChartTooltipProps, Gradient, GradientStop } from 'reaviz'
import '../App.css'

type AutosizeChartProps = {
  chartData: {
    key: string;
    data: number;
  }[];
  tooltipComponent: React.ReactElement<ChartTooltipProps, React.FC<Partial<ChartTooltipProps>>>
  images: { [key: string]: string}
}

const shouldRenderBigImg = (bubbleValue: number, maxChartValue: number | undefined, isMobile: boolean) => {
  if (maxChartValue) {
    const percent = (bubbleValue / maxChartValue) * 100
    return isMobile ? percent > 9 : percent > 15
  }  
}

export const AutosizeChart: React.FC<AutosizeChartProps> = ({ chartData, tooltipComponent, images }) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;
  const maxChartValue = max(map(chartData, coin => coin.data))

  const formatBubbleLabel = (data: any) => {
    const marketCap = data.data.data
  
    return shouldRenderBigImg(marketCap, maxChartValue, isMobile) ? (
      <g>
        <image y={-20} x={-20} height={40} width={40} href={images?.[data.data.key]} />
      </g>
    ) : (
      <g>
        <image y={-10} x={-10} height={20} width={20} href={images?.[data.data.key]} />
      </g>
    )
  }

  return (
    <div className='chart'>
      <BubbleChart 
        data={chartData}
        series={
          <BubbleSeries 
            colorScheme="YlGn"
            animated={false}
            bubble={
              <Bubble
                tooltip={tooltipComponent}
                gradient={
                  <Gradient
                      stops={[
                        <GradientStop
                          offset="5%"
                          stopOpacity={0.25}
                          key="start"
                        />,
                        <GradientStop offset="90%" stopOpacity={0.7} key="stop" />
                      ]}
                    />
                }
              />
            }
            label={
              <BubbleLabel 
                format={formatBubbleLabel}
              />
            }
          />
        }
      />
    </div>
  )
}