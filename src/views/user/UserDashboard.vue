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
import { apiService } from '../../services/api.service'

const apiMessage = ref('')
const { user, isLoading, logout } = useAuth0()

const callPublicApi = async () => {
  try {
    const response = await apiService.user.getProfile()
    apiMessage.value = response.data.message
  } catch (error) {
    apiMessage.value = 'Error calling public API'
    console.error(error)
  }
}

const callPrivateApi = async () => {
  try {
    const response = await apiService.user.getSettings()
    apiMessage.value = response.data.message
  } catch (error) {
    console.error('Private API Error:', error)
    apiMessage.value = `Error calling private API: ${error.message}`
  }
}

const handleLogout = () => {
  logout({ returnTo: window.location.origin })
}
</script>
