import { apiService } from '../api.service'

export const cryptoWalletService = {
  async getCryptoWallets() {
    try {
      const ids = await this.getWalletIds()
      const balances = await this.getWalletBalances(ids)
      return balances
    } catch (error) {
      console.error('Error fetching crypto wallets:', error)
      throw error
    }
  },
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

  async renameWallet(walletId, newName) {
    try {
      const response = await apiService.cryptoWallet.rename({ walletId, newName })
      return response.data
    } catch (error) {
      console.error('Error renaming wallet:', error)
      throw error
    }
  },

  async deleteWallet(sourceWalletId, targetWalletId) {
    try {
      const response = await apiService.cryptoWallet.delete({ sourceWalletId, targetWalletId })
      return response.data
    } catch (error) {
      console.error('Error deleting wallet:', error)
      throw error
    }
  },

  async deposit(cryptoWalletId, cryptocurrencySymbol, amount) {
    try {
      const response = await apiService.cryptoWallet.deposit({
        cryptoWalletId: cryptoWalletId,
        symbol: cryptocurrencySymbol,
        amount: amount,
      })
      return response.data
    } catch (error) {
      console.error('Error depositing:', error)
      throw error
    }
  },
}
