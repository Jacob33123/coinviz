import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class GetCoinsController {
  public MS_IN_MINUTE = 60000

  public async getLatestDbEntry(params) {
    const {category} = params
    const selectedCategory = category ? category : 'all'
    
    const result = await Database
      .from('coins')
      .where('category', selectedCategory)
      .select('*')
      .orderBy('id', 'desc')

    return result?.[0]
  }

  public async createDbEntry(params, dataObj) {
    const {category} = params
    const selectedCategory = category ? category : 'all'
    const data = JSON.stringify(dataObj)
    await Database
      .table('coins')
      .insert({
        category: selectedCategory,
        data
      })
  }

  public async updateDbEntry(params, dataObj) {
    const {category} = params
    const selectedCategory = category ? category : 'all'
    const data = JSON.stringify(dataObj)

    await Database
      .from('coins')
      .where('category', selectedCategory)
      .update({ data, updated_at: new Date() })
  }

  public async handle({ params }: HttpContextContract) {
    try {
      const {category, listSize} = params
      const baseUrl = Env.get('COINGECKO_API_BASE_URL')
      const latestEntry = await this.getLatestDbEntry(params)
      
      const currentTimestamp = new Date().getTime()
      const dbEntryTimestamp = latestEntry 
        ? new Date(latestEntry.updated_at).getTime() 
        : null
      
      const minuesSinceLastFetch = dbEntryTimestamp 
        ? (currentTimestamp - dbEntryTimestamp) / this.MS_IN_MINUTE 
        : null

      const shouldReturnLatestDbEntry = minuesSinceLastFetch && minuesSinceLastFetch < 10

      if (shouldReturnLatestDbEntry) {
        return latestEntry.data.slice(0, listSize)
      } else {
        const {data} = await axios.get(`${baseUrl}/coins/markets`, {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: '1',
            sparkline: 'false',
            locale: 'en',
            category
          },
          headers: {
            'accept': 'application/json'
          }
        });

        if (latestEntry) {
          await this.updateDbEntry(params, data)
        } else {
          await this.createDbEntry(params, data)
        }

        return data.slice(0, listSize)
      }

    } catch (error) {
      throw error
    }
  }
}