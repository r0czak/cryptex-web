import { apiService } from '../api.service'

export const cryptoWalletService = {
  async getWalletBalances(walletIds) {
    try {
      const response = await apiService.cryptoWallet.getBalances(walletIds)
      return response.data
    } catch (error) {
      console.error('Error fetching wallet balances:', error)
      throw error
    }
  },

  async getWalletIds() {
    try {
      const response = await apiService.cryptoWallet.getIds()
      return response.data
    } catch (error) {
      console.error('Error fetching wallet IDs:', error)
      throw error
    }
  },

  async createWallet(walletName) {
    try {
      const response = await apiService.cryptoWallet.create({ walletName })
      return response.data
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw error
    }
  },

  async deposit(cryptoWalletId, cryptocurrencyName, amount) {
    try {
      const response = await apiService.cryptoWallet.deposit(
        cryptoWalletId,
        cryptocurrencyName,
        amount
      )
      return response.data
    } catch (error) {
      console.error('Error depositing:', error)
      throw error
    }
  },
}
