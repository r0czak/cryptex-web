import axios from 'axios'
import { authService } from './auth/auth.service'
import { API_CONFIG } from '../config/api.config'

const createApiClient = (baseURL = API_CONFIG.baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use(async (config) => {
    // console.log(config)
    if (authService.getIsAuthenticated()) {
      const token = await authService.getToken()
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return client
}

const apiClient = createApiClient()

export const apiService = {
  auth: {
    signin: (credentials) => apiClient.post(API_CONFIG.endpoints.auth.signin, credentials),
    signup: (userData) => apiClient.post(API_CONFIG.endpoints.auth.signup, userData),
    refresh: () => apiClient.post(API_CONFIG.endpoints.auth.refresh),
    getApiKey: () => apiClient.get(API_CONFIG.endpoints.auth.apiKey),
    generateApiKey: (data) => apiClient.post(API_CONFIG.endpoints.auth.generateApiKey, data),
    revokeApiKey: () => apiClient.delete(API_CONFIG.endpoints.auth.revokeApiKey),
  },
  cryptocurrency: {
    getCryptocurrencies: () => apiClient.get(API_CONFIG.endpoints.cryptocurrency.base),
  },
  cryptoWallet: {
    create: (data) => apiClient.post(API_CONFIG.endpoints.cryptoWallet.create, data),
    getIds: () => apiClient.get(API_CONFIG.endpoints.cryptoWallet.ids),
    getBalances: (walletIds) =>
      apiClient.post(API_CONFIG.endpoints.cryptoWallet.balances, walletIds),
    deposit: (data) => apiClient.post(API_CONFIG.endpoints.cryptoWallet.deposit, data),
    rename: (data) => apiClient.post(API_CONFIG.endpoints.cryptoWallet.rename, data),
    delete: (data) => apiClient.post(API_CONFIG.endpoints.cryptoWallet.delete, data),
  },
  fiatWallet: {
    getIds: () => apiClient.get(API_CONFIG.endpoints.fiatWallet.ids),
    getBalances: (walletIds) => apiClient.post(API_CONFIG.endpoints.fiatWallet.balances, walletIds),
    deposit: (data) => apiClient.post(API_CONFIG.endpoints.fiatWallet.deposit, data),
  },
  market: {
    placeOrder: (data) => apiClient.post(API_CONFIG.endpoints.market.placeOrder, data),
    getBuyOrders: (params) => apiClient.get(API_CONFIG.endpoints.market.getBuyOrders, { params }),
    getSellOrders: (params) => apiClient.get(API_CONFIG.endpoints.market.getSellOrders, { params }),
  },
  user: {
    getProfile: () => apiClient.get(API_CONFIG.endpoints.user.profile),
    updateProfile: (data) => apiClient.put(API_CONFIG.endpoints.user.profile, data),
    getSettings: () => apiClient.get(API_CONFIG.endpoints.user.settings),
  },
  admin: {
    getUsers: (params) => apiClient.get(API_CONFIG.endpoints.admin.users, { params }),
    getSystemStatus: () => apiClient.get(API_CONFIG.endpoints.admin.system),
  },
  vwap: {
    getCurrent: (params) => apiClient.get(API_CONFIG.endpoints.vwap.current, { params }),
    getHistory: (params) => apiClient.get(API_CONFIG.endpoints.vwap.history, { params }),
  },
}
