<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <button class="hamburger" @click="toggleMenu" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <router-link to="/" class="logo">Cryptex</router-link>
    </div>

    <!-- Hamburger Menu -->
    <div class="menu" :class="{ 'menu-active': isMenuOpen }">
      <router-link to="/trades" class="menu-item" @click="closeMenu">Trades</router-link>
      <router-link to="/orders" class="menu-item" @click="closeMenu">Orders</router-link>
      <router-link to="/wallets" class="menu-item" @click="closeMenu">Wallets</router-link>
      <router-link v-if="hasAdminRole" to="/users" class="menu-item" @click="closeMenu">Users</router-link>
    </div>

    <!-- Right side buttons -->
    <div class="navbar-end">
      <div class="profile-dropdown" v-if="user">
        <button class="profile-button" @click="toggleProfile">
          <img :src="user.picture" :alt="user.name" class="avatar" />
        </button>
        <div class="dropdown-content" :class="{ show: isProfileOpen }">
          <div class="user-info">
            <p class="user-name">{{ user.name }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
          <button class="logout-button" @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { authService } from '../../services/auth/auth.service'
import { permissionService } from '../../services/auth/permission.service'
const { user, logout } = useAuth0()
const isMenuOpen = ref(false)
const isProfileOpen = ref(false)

const hasAdminRole = async () => {
  try {
    const permissions = await permissionService.getPermissions()
    return permissions?.includes('write:admin_role') || false
  } catch {
    return false
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) isProfileOpen.value = false
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) isMenuOpen.value = false
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = () => {
  authService.clearToken()
  logout({ returnTo: window.location.origin })
}
</script>
