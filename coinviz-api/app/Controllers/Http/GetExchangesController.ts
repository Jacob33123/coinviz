import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class GetExchangesController {
  public MS_IN_MINUTE = 60000

  public async getLatestDbEntry() {
    
    const result = await Database
      .from('exchanges')
      .select('*')
      .orderBy('id', 'desc')

    return result?.[0]
  }

  public async createDbEntry(dataObj) {
    const data = JSON.stringify(dataObj)
    await Database
      .table('exchanges')
      .insert({
        data
      })
  }

  public async updateDbEntry(dataObj) {
    const data = JSON.stringify(dataObj)

    await Database
      .from('exchanges')
      .update({ data, updated_at: new Date() })
  }

  public async handle({ params }: HttpContextContract) {
    try {
      const numExchanges = params?.numExchanges ? Number(params.numExchanges) : 10
      const baseUrl = Env.get('COINGECKO_API_BASE_URL')
      const latestEntry = await this.getLatestDbEntry()

      const currentTimestamp = new Date().getTime()
      const dbEntryTimestamp = latestEntry 
        ? new Date(latestEntry.updated_at).getTime() 
        : null
      
      const minuesSinceLastFetch = dbEntryTimestamp 
        ? (currentTimestamp - dbEntryTimestamp) / this.MS_IN_MINUTE 
        : null

      const shouldReturnLatestDbEntry = minuesSinceLastFetch && minuesSinceLastFetch < 10


      if (shouldReturnLatestDbEntry) {
        return latestEntry.data.slice(0, numExchanges)
      } else {
        const {data} = await axios.get(`${baseUrl}/exchanges`, {
          headers: {
            'accept': 'application/json'
          }
        })
        
        const exchangesByVolumeDesc = data.sort((a, b) => {
          if (a.trade_volume_24h_btc > b.trade_volume_24h_btc) {
            return -1
          }
  
          if (a.trade_volume_24h_btc < b.trade_volume_24h_btc) {
            return 1
          }
  
          else return 0
        })

        if (latestEntry) {
          await this.updateDbEntry(exchangesByVolumeDesc)
        } else {
          await this.createDbEntry(exchangesByVolumeDesc)
        }
  
        return exchangesByVolumeDesc.slice(0, numExchanges)
      }

      
    } catch (error) {
      throw error
    } 
  }


}