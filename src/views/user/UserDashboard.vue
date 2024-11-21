<template>
  <div class="user-dashboard">
    <div v-if="isLoading">
      <h1>Loading...</h1>
    </div>
    <div v-else>
      <h1>Welcome, {{ user?.name }}!</h1>
      <button @click="callPublicApi">Call Public API</button>
      <button @click="callPrivateApi">Call Private API</button>
      <button @click="handleLogout">Log out</button>
      <div v-if="apiMessage" class="api-message">
        {{ apiMessage }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { API_CONFIG } from '../../config/api.config'

const apiMessage = ref('')
const { user, isLoading, getAccessTokenSilently, logout } = useAuth0()

const callPublicApi = async () => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.public}`)
    const data = await response.json()
    apiMessage.value = data.message
  } catch (error) {
    apiMessage.value = 'Error calling public API'
    console.error(error)
  }
}

const callPrivateApi = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.private}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    apiMessage.value = data.message
  } catch (error) {
    console.error('Private API Error:', error)
    apiMessage.value = `Error calling private API: ${error.message}`
  }
}

const handleLogout = () => {
  logout({ returnTo: window.location.origin })
}
</script>
