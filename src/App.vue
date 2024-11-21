<template>
  <div class="app">
    <Navbar />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/common/MainNavbar.vue'
</script>

<style>
.app {
  min-height: 100vh;
}

.content {
  margin-top: 60px;
  padding: 20px;
}
</style>
