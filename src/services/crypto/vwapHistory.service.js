import { apiService } from '../api.service'

export const vwapService = {
  async getCurrentVWAP(cryptoSymbol, fiatSymbol, interval) {
    const response = await apiService.vwap.getCurrent({
      cryptoSymbol,
      fiatSymbol,
      interval,
    })
    return response.data
  },
  async getVWAPHistory(params) {
    const response = await apiService.vwap.getHistory(params)
    return response.data
  },
}
