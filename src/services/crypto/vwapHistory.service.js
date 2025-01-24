import { apiService } from '../api.service'

export const vwapService = {
  async getCurrentVWAP(params) {
    const response = await apiService.vwap.getCurrent(params)
    return response.data
  },
  async getVWAPHistory(params) {
    const response = await apiService.vwap.getHistory(params)
    return response.data
  },
}
