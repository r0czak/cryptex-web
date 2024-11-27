<template>
  <div class="app">
    <Navbar v-if="isAuthenticated" />
    <div class="content" :class="{ 'no-navbar': !isAuthenticated }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from './components/common/navbar/MainNavbar.vue'
import { authService } from './services/auth/auth.service'

const isAuthenticated = computed(() => authService.getIsAuthenticated())
</script>

<style>
.app {
  min-height: 100vh;
}

.content {
  margin-top: 60px;
  padding: 20px;
}

.content.no-navbar {
  margin-top: 0;
}
</style>
