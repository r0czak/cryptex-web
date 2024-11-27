<template>
  <div class="login-page">
    <RotatingCoin />
    <h1>Cryptex</h1>
    <p>Log in to continue</p>
    <button class="basic-button" @click="handleLogin">Log In</button>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import RotatingCoin from '../components/common/RotatingCoin.vue'

const { loginWithRedirect } = useAuth0()

const handleLogin = () => {
  loginWithRedirect({
    appState: { target: '/callback' },
  })
}
</script>
