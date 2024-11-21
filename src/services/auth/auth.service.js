import { ref } from 'vue'
import { eventBus } from '../eventBus.service'
import axios from 'axios'
import { AUTH_BE_CONFIG } from '../../config/auth/auth.be.config'

class AuthService {
  constructor() {
    this.accessToken = ref(localStorage.getItem('accessToken') || null)
    this.tokenExpiry = ref(
      localStorage.getItem('tokenExpiry') ? parseInt(localStorage.getItem('tokenExpiry')) : null
    )
    this.isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

    eventBus.subscribe('login', async () => {
      await this.getToken()
      await this.signIn()
    })
  }

  async getToken() {
    const now = Date.now()
    if (this.accessToken.value && this.tokenExpiry.value && now < this.tokenExpiry.value) {
      return this.accessToken.value
    }

    try {
      const auth0 = window.auth0Instance
      await new Promise((resolve) => {
        if (!auth0.isLoading.value) {
          resolve()
        } else {
          const checkLoading = setInterval(() => {
            if (!auth0.isLoading.value) {
              clearInterval(checkLoading)
              resolve()
            }
          }, 50)
        }
      })

      const token = await auth0.getAccessTokenSilently()
      const payload = JSON.parse(atob(token.split('.')[1]))

      this.accessToken.value = token
      this.tokenExpiry.value = payload.exp * 1000
      this.isAuthenticated.value = auth0.isAuthenticated.value

      // Store values in localStorage
      localStorage.setItem('accessToken', token)
      localStorage.setItem('tokenExpiry', payload.exp * 1000)
      localStorage.setItem('isAuthenticated', auth0.isAuthenticated.value)

      return token
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  async signIn() {
    console.log('signIn')
    const apiClient = axios.create({
      baseURL: AUTH_BE_CONFIG.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    apiClient.interceptors.request.use(async (config) => {
      const token = await this.getToken()
      config.headers.Authorization = `Bearer ${token}`
      return config
    })

    try {
      const response = await apiClient.post(AUTH_BE_CONFIG.endpoints.signin)

      if (!response.data || response.status != 200) {
        throw new Error('Sign in failed')
      }

      console.log('signIn response:', response)
      return response
    } catch (error) {
      console.error('Error signing in:', error)
      this.clearToken()
      window.auth0Instance.logout({ returnTo: window.location.origin })
      throw error
    }
  }

  getIsAuthenticated() {
    return this.isAuthenticated.value
  }

  clearToken() {
    this.accessToken.value = null
    this.tokenExpiry.value = null
    this.isAuthenticated.value = false

    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenExpiry')
    localStorage.removeItem('isAuthenticated')

    eventBus.publish('tokenCleared')
  }
}

export const authService = new AuthService()
