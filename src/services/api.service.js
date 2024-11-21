import axios from 'axios'
import { authService } from './auth/auth.service'
import { API_CONFIG } from '../config/api.config'

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  if (authService.getIsAuthenticated()) {
    const token = await authService.getToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiService = {
  public: {
    getMessage: () => apiClient.get(API_CONFIG.endpoints.public),
  },
  private: {
    getMessage: () => apiClient.get(API_CONFIG.endpoints.private),
  },
  admin: {
    getMessage: () => apiClient.get(API_CONFIG.endpoints.admin),
  },
}
