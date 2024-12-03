<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Crypto Wallets</h1>
      <button @click="showCreateWalletPopup = true" class="btn btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 mr-2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create New Wallet
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="max-w-2xl mx-auto mt-8">
      <ErrorMessage title="Failed to load wallet" :message="error" :retryAction="fetchWalletData" />
    </div>

    <div v-else-if="walletData.length === 0" class="hero min-h-[400px] bg-base-200 rounded-box">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h2 class="text-2xl font-bold mb-4">No Wallets Found</h2>
          <p class="mb-6">Create your first crypto wallet to get started!</p>
          <button @click="showCreateWalletPopup = true" class="btn btn-primary">
            Create New Wallet
          </button>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <router-link
        v-for="wallet in walletData"
        :key="wallet.cryptoWalletId"
        :to="`/crypto-wallets/${wallet.cryptoWalletId}`"
        class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <div class="card-body">
          <h2 class="card-title font-mono">{{ wallet.walletName }}</h2>
          <div class="space-y-2 mt-4">
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
