<template>
  <div class="callback-page">
    <h1>Loading...</h1>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { authService } from '../services/auth/auth.service'

const router = useRouter()

  ; (async () => {
    try {
      await authService.getToken()
      // Get token and update auth state
      if (authService.getIsAuthenticated()) {
        await authService.getToken()
        console.log('Authentication successful')
        router.replace('/')
      } else {
        console.error('Authentication failed')
        router.replace('/login')
      }
    } catch (error) {
      console.error('Callback error:', error)
      router.replace('/login')
    }
  })()
</script>
