import { apiService } from '../api.service'

export const marketService = {
  async placeOrder(orderData) {
    try {
      const response = await apiService.market.placeOrder(orderData)
      return response.data
    } catch (error) {
      console.error('Error placing order:', error)
      throw error
    }
  },

  async getBuyOrders(cryptoSymbol, page = 0, size = 10) {
    try {
      const response = await apiService.market.getBuyOrders({ cryptoSymbol, page, size })
      return response.data
    } catch (error) {
      console.error('Error fetching buy orders:', error)
      throw error
    }
  },

  async getSellOrders(cryptoSymbol, page = 0, size = 10) {
    try {
      const response = await apiService.market.getSellOrders({ cryptoSymbol, page, size })
      return response.data
    } catch (error) {
      console.error('Error fetching sell orders:', error)
      throw error
    }
  },
}
