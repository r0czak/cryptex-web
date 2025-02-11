import { apiService } from '../api.service'

export const fiatWalletService = {
  async getFiatWallets() {
    try {
      const ids = await this.getWalletIds()
      const balances = await this.getWalletBalances(ids)
      return balances
    } catch (error) {
      console.error('Error fetching fiat wallets:', error)
      throw error
    }
  },

  async getWalletBalances(walletIds) {
    try {
      const response = await apiService.fiatWallet.getBalances(walletIds)
      return response.data
    } catch (error) {
      console.error('Error fetching wallet balances:', error)
      throw error
    }
  },

  async getWalletIds() {
    try {
      const response = await apiService.fiatWallet.getIds()
      return response.data
    } catch (error) {
      console.error('Error fetching wallet IDs:', error)
      throw error
    }
  },

  async deposit(fiatWalletId, fiatCurrency, amount) {
    try {
      const response = await apiService.fiatWallet.deposit({
        fiatWalletId: fiatWalletId,
        symbol: fiatCurrency,
        amount: amount,
      })
      return response.data
    } catch (error) {
      console.error('Error depositing:', error)
      throw error
    }
  },
}
