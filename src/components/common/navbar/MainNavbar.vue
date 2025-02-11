<template>
  <div class="navbar bg-base-200 fixed top-0 w-full z-50">
    <div class="navbar-start">
      <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="isMenuOpen" />
        <div class="drawer-content">
          <label for="my-drawer" class="btn btn-ghost drawer-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu bg-base-200 text-base-content h-full w-80 p-4">
            <li>
              <router-link to="/market" @click="closeMenu">
                <ChartBarIcon class="h-5 w-5" />
                Market
              </router-link>
            </li>
            <li>
              <router-link to="/trades" @click="closeMenu">
                <ArrowsRightLeftIcon class="h-5 w-5" />
                Trades
              </router-link>
            </li>
            <li>
              <router-link to="/orders" @click="closeMenu">
                <ClipboardDocumentListIcon class="h-5 w-5" />
                Orders
              </router-link>
            </li>
            <li>
              <details>
                <summary>
                  <WalletIcon class="h-5 w-5" />
                  Wallets
                </summary>
                <ul>
                  <li>
                    <router-link to="/crypto-wallets" @click="closeMenu">
                      Crypto Wallets
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/fiat-wallets" @click="closeMenu"> FIAT Wallets </router-link>
                  </li>
                </ul>
              </details>
            </li>
            <li v-if="hasAdminRole">
              <router-link to="/users" @click="closeMenu">
                <UsersIcon class="h-5 w-5" />
                Users
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="navbar-center">
      <router-link to="/" class="btn btn-ghost text-xl">Cryptex</router-link>
    </div>

    <div class="navbar-end">
      <div class="dropdown dropdown-end" v-if="user">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar"
          @click="toggleProfile"
        >
          <div class="w-10 rounded-full">
            <img :src="user.picture" :alt="user.name" />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          :class="{ hidden: !isProfileOpen }"
        >
          <li class="disabled">
            <a class="justify-between">
              {{ user.name }}
            </a>
          </li>
          <li>
            <router-link to="/profile" class="justify-between" @click="isProfileOpen = false">
              Profile
            </router-link>
          </li>
          <li><a class="btn btn-outline btn-error" @click="handleLogout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { authService } from '../../../services/auth/auth.service'
import { permissionService } from '../../../services/auth/permission.service'
import {
  ChartBarIcon,
  ArrowsRightLeftIcon,
  ClipboardDocumentListIcon,
  WalletIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

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
