<template>
  <div class="wallet-submenu">
    <router-link to="/crypto-wallets" class="submenu-item" @click="$emit('close')">
      <CurrencyDollarIcon class="submenu-icon" />
      Crypto Wallets
    </router-link>
    <router-link to="/fiat-wallets" class="submenu-item" @click="$emit('close')">
      <BanknotesIcon class="submenu-icon" />
      FIAT Wallets
    </router-link>
  </div>
</template>

<script setup>
import { CurrencyDollarIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
</script>
