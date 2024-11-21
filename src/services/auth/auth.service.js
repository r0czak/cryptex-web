import { ref } from 'vue'
import { eventBus } from '../eventBus.service'

class AuthService {
  constructor() {
    this.accessToken = ref(localStorage.getItem('accessToken') || null)
    this.tokenExpiry = ref(
      localStorage.getItem('tokenExpiry') ? parseInt(localStorage.getItem('tokenExpiry')) : null
    )
    this.isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

    eventBus.subscribe('login', async () => {
      await this.getToken()
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
