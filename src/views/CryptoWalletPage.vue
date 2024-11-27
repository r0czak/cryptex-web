<template>
  <div class="wallet-page">
    <div class="header">
      <h1>Crypto Wallets</h1>
      <button @click="showCreateWalletPopup = true" class="basic-button create-wallet-btn">
        Create New Wallet
      </button>
    </div>

    <div v-if="isLoading" class="loading">Loading wallet...</div>

    <div v-else-if="error" class="error">
      <ErrorMessage title="Failed to load wallet" :message="error" :retryAction="fetchWalletData" />
    </div>

    <div v-else class="wallet-container">
      <router-link
        v-for="wallet in walletData"
        :key="wallet.cryptoWalletId"
        :to="`/crypto-wallets/${wallet.cryptoWalletId}`"
        class="wallet-link"
      >
        <div class="wallet-card">
          <h3 class="wallet-name">{{ wallet.walletName }}</h3>
          <div class="balances-list">
            <BalanceListItem
              v-for="balance in wallet.balances"
              :key="balance.cryptocurrencyName"
              :cryptocurrencyName="balance.cryptocurrencyName"
              :cryptocurrencySymbol="balance.cryptocurrencySymbol"
              :balance="balance.balance"
            />
          </div>
        </div>
      </router-link>
    </div>

    <CreateWalletPopup
      :is-open="showCreateWalletPopup"
      @close="showCreateWalletPopup = false"
      @wallet-created="handleWalletCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cryptoWalletService } from '../services/crypto/cryptoWallet.service'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import BalanceListItem from '../components/wallet/BalanceListItem.vue'
import CreateWalletPopup from '../components/wallet/CreateWalletPopup.vue'

const walletData = ref([])
const isLoading = ref(true)
const error = ref(null)
const showCreateWalletPopup = ref(false)

const fetchWalletData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const walletIds = await cryptoWalletService.getWalletIds()
    if (Array.isArray(walletIds) && walletIds.length > 0) {
      const response = await cryptoWalletService.getWalletBalances(walletIds)
      walletData.value = response.wallets
    } else {
      walletData.value = []
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch wallet data'
  } finally {
    isLoading.value = false
  }
}

const handleWalletCreated = () => {
  fetchWalletData()
}

onMounted(() => {
  fetchWalletData()
})
</script>
