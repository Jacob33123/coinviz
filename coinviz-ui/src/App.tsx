import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'
import { Category, Coin, Exchange, SelectedPage } from './types'
import Navbar from './components/NavBar';
import Header from './components/Header';
import Filters from './components/Filters';
import { SelectedChart } from './components/SelectedChart';

export const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>('Cryptocurrencies')
  const [coinList, setCoinList] = useState<Coin[]>([])
  const [exchangeList, setExchangeList] = useState<Exchange[]>([])
  const [categoryList, setCategoryList] = useState<Category[] | null>(null)
  const [category, setCategory] = useState(null)
  const [coinListSize, setCoinListSize] = useState(10)
  const [numExchanges, setNumExchanges] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<string>('market_cap')

  useEffect(() => {
    const fetchCoinList = async () => {
      setIsLoading(true)
  
      const url = category 
        ? `${process.env.REACT_APP_COINVIZ_API_BASE_URL}/coins/${coinListSize}/${category}` 
        :  `${process.env.REACT_APP_COINVIZ_API_BASE_URL}/coins/${coinListSize}`
  
      const {data} = await axios.get(url)
  
      setIsLoading(false)
      
      if (data?.length) {
        setCoinList(data)
      }
    }

    fetchCoinList()
  }, [category, coinListSize])

  useEffect(() => {
    const fetchExchangeList = async () => {
      setIsLoading(true)
  
      const url = `${process.env.REACT_APP_COINVIZ_API_BASE_URL}/exchanges/${numExchanges}`
  
      const {data} = await axios.get(url)
  
      setIsLoading(false)
      
      if (data?.length) {
        setExchangeList(data)
      }
    }

    if (!exchangeList?.length) {
      fetchExchangeList()
    }

    if (numExchanges) {
      fetchExchangeList()
    }
  }, [selectedPage, exchangeList?.length, numExchanges])

  useEffect(() => {
    const fetchCategoryList = async () => {
      setIsLoading(true)
      const {data} = await axios.get(`${process.env.REACT_APP_COINGECKO_API_BASE_URL}/coins/categories/list`, {
        headers: {
          'accept': 'application/json'
        }
      })
  
      setIsLoading(false)
      
      if (data?.length) {
        setCategoryList(data)
      }
    }

    if (!categoryList) {
      fetchCategoryList()
    }
  }, [categoryList])
  
  return (
    <div className="App">
      <Navbar navigateTo={setSelectedPage}/>
      <Header selectedPage={selectedPage} />
      <Filters
        selectedPage={selectedPage}
        categoryList={categoryList}
        setCategory={setCategory}
        setCoinListSize={setCoinListSize}
        setNumExchanges={setNumExchanges}
        setSortBy={setSortBy}
      />
      <SelectedChart 
        selectedPage={selectedPage}
        isLoading={isLoading}
        exchangeList={exchangeList}
        coinList={coinList}
      />
    </div>
  );
}

export default App;
