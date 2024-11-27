import { apiService } from '../api.service'

export const cryptoPriceService = {
  async getPrice(cryptocurrencySymbol) {
    const response = await apiService.cryptoMarket.getPrice(cryptocurrencySymbol)
    return response.data
  },
}
