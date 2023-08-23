import React from "react";
import { SelectedPage } from "../types";
import '../App.css'

type HeaderProps = {
  selectedPage: SelectedPage
}

const Header: React.FC<HeaderProps> = ({selectedPage}) => (
  <div className="header">{
    selectedPage === 'Cryptocurrencies' 
      ? 'Top Cryptocurrencies by Market Cap' 
      : 'Top Exchanges by 24 Hour Volume'}
  </div>
)

export default Header