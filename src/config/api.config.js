export const API_CONFIG = {
  baseURL: import.meta.env.VITE_SPRING_BASE_API,
  endpoints: {
    auth: {
      base: '/api/v1/auth',
      signin: '/api/v1/auth/signin',
      signup: '/api/v1/auth/signup',
      refresh: '/api/v1/auth/refresh',
    },
    cryptoMarket: {
      base: '/api/v1/crypto-market',
      price: '/api/v1/crypto-market/price',
    },
    cryptoWallet: {
      base: '/api/v1/crypto-wallet',
      create: '/api/v1/crypto-wallet/create',
      rename: '/api/v1/crypto-wallet/rename',
      delete: '/api/v1/crypto-wallet/delete',
      deposit: '/api/v1/crypto-wallet/deposit',
      balances: '/api/v1/crypto-wallet/balances',
      ids: '/api/v1/crypto-wallet/ids',
    },
    trading: {
      base: '/api/v1/trading',
      orders: '/api/v1/trading/orders',
      trades: '/api/v1/trading/trades',
      marketData: '/api/v1/trading/market-data',
    },
    user: {
      base: '/api/v1/user',
      profile: '/api/v1/user/profile',
      settings: '/api/v1/user/settings',
    },
    admin: {
      base: '/api/v1/admin',
      users: '/api/v1/admin/users',
      system: '/api/v1/admin/system',
    },
  },
  versions: {
    v1: 'v1',
  },
}
