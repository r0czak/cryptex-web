import { apiService } from '../api.service'

export const userService = {
  async getApiKey() {
    const response = await apiService.auth.getApiKey()
    return response.data
  },
  async generateApiKey(data) {
    const response = await apiService.auth.generateApiKey(data)
    return response.data
  },
  async revokeApiKey() {
    const response = await apiService.auth.revokeApiKey()
    return response.data
  },
}
