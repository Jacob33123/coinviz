import { map, round, toNumber } from "lodash";
import { Category, Coin, Exchange } from "./types";

export const getCoinChartData = (coinList: Coin[]) => coinList.map(
  coin => {
    return {
      key: coin.symbol,
      data: coin.market_cap
    }
  })

export const getExchangeChartData = (exchangeList: Exchange[]) => map(
  exchangeList, (exchange) => ({
    key: exchange.id,
    data: toNumber(exchange.trade_volume_24h_btc)
  })
)

export const getCategoryOptions = (categories: Category[] | null) => {
  const categoryOptions = categories?.length ? categories.map(category => ({
    label: category.name,
    value: category.category_id
  })) : []

  return [
    { label: 'All', value: null },
    ...categoryOptions
  ]
}

export const getCoinImages = (coins: Coin[]) => coins.reduce(
  (imgList: { [symbol: string]: string }, coin) => {
    imgList[coin.symbol]=coin.image
    return imgList
}, {})

export const getExchangeImages = (exchanges: Exchange[]) => exchanges.reduce(
  (imgList: { [id: string]: string }, exchange) => {
    imgList[exchange.id]=exchange.image
    return imgList
}, {})

export const getCoinNames = (coins: Coin[]) => coins.reduce(
  (nameList: { [symbol: string]: string }, coin) => {
    nameList[coin.symbol]=coin.name
    return nameList
}, {})

export const getExchangeNames = (exchanges: Exchange[]) => exchanges.reduce(
  (nameList: { [symbol: string]: string }, exchange) => {
    nameList[exchange.id]=exchange.name
    return nameList
}, {})

export const getFormattedValue = (value: number) => {
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(round(value, 2))
  return `${formattedValue}`
}