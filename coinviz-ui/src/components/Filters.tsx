import React from 'react'
import { Category, SelectedPage } from '../types'
import Select, { ActionMeta } from 'react-select'
import { map, range } from 'lodash'
import { getCategoryOptions } from '../utils'

type FiltersProps = {
  selectedPage: SelectedPage
  categoryList: Category[] | null
  setCategory: (value: React.SetStateAction<null>) => void
  setCoinListSize: (value: React.SetStateAction<number>) => void
  setNumExchanges: (value: React.SetStateAction<number>) => void
}

const Filters: React.FC<FiltersProps> = ({
  selectedPage,
  categoryList,
  setCategory,
  setCoinListSize,
  setNumExchanges,
}) => {
  const listSizeOptions = map(range(1, 21), num => ({value: num, label: num}))

  const handleChangeCategory = (newValue: any, actionMeta: ActionMeta<string>) => {
    if (newValue) {
      return setCategory(newValue.value)
    }
  }

  const handleChangeCoinListSize = (newValue: any, actionMeta: ActionMeta<string>) => {
    if (newValue) {
      return setCoinListSize(newValue.value)
    }
  }

  const handleChangeNumExchanges = (newValue: any, actionMeta: ActionMeta<string>) => {
    if (newValue) {
      return setNumExchanges(newValue.value)
    }
  }

  switch(selectedPage) {
    case 'Exchanges':
      return (
        <div className='num_exchanges'>
          <div className='dropdown_wrapper'>
            <div className='dropdown_label'>Number of Exchanges to Display</div>
            <Select
              key='numExchangesSelect'
              options={listSizeOptions as any}
              onChange={handleChangeNumExchanges}
              defaultValue={listSizeOptions[9] as any}
              placeholder="# Exchanges"
              className="dropdown"
            />
          </div>
        </div>
      )
    default:
      return (
        <div className="dropdowns">
          <div className='dropdown_wrapper'>
            <div className='dropdown_label'>Category</div>
            <Select
              key='categorySelect'
              options={getCategoryOptions(categoryList) as any} 
              onChange={handleChangeCategory}
              defaultValue={null} 
              placeholder="All"
              className="dropdown"
            />
          </div>
          <div className='dropdown_wrapper'>
            <div className='dropdown_label'>Number of Coins to Display</div>
            <Select
              key='numCoinsSelect'
              options={listSizeOptions as any}
              onChange={handleChangeCoinListSize}
              defaultValue={listSizeOptions[9] as any}
              placeholder="# Coins"
              className="dropdown"
            />
          </div>
        </div>
      )
  }
}

export default Filters