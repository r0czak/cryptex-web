<template>
  <div class="login-page">
    <h1>Cryptex</h1>
    <button @click="handleLogin">Log In</button>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { eventBus } from '../services/eventBus.service'
const { loginWithRedirect } = useAuth0()

const handleLogin = () => {
  loginWithRedirect({
    appState: { target: '/callback' },
  })
  eventBus.publish('login')
}
</script>
