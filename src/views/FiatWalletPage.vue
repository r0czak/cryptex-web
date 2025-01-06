<template>
  <div class="p-8">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="error">
      <ErrorMessage title="Failed to load wallet" :message="error" :retryAction="fetchWalletData" />
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-bold">FIAT Wallet</h1>
        </div>
        <ControlContainer horizontal>
          <button class="btn btn-primary" @click="showAddBalancePopup = true">Add Balance</button>
        </ControlContainer>
      </div>

      <WalletSummary :total-balance="totalBalance" />

      <div class="mt-10">
        <h2 class="text-xl font-bold mb-4">Your FIAT Currencies</h2>
        <div class="balances-list">
          <DetailedFIATBalanceListItem
            v-for="balance in wallet.balances"
            :key="balance.fiatCurrencyName"
            :currency-name="balance.fiatCurrencyName"
            :currency-symbol="balance.fiatCurrencySymbol"
            :balance="balance.balance"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <AddFIATBalancePopup
        :is-open="showAddBalancePopup"
        :fiat-wallet-id="wallet?.fiatWalletId || 0"
        @close="showAddBalancePopup = false"
        @balance-added="handleWalletChanged"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fiatWalletService } from '../services/fiat/fiatWallet.service'

import AddFIATBalancePopup from '../components/wallet/AddFIATBalancePopup.vue'
import WalletSummary from '../components/wallet/WalletSummary.vue'
import DetailedFIATBalanceListItem from '../components/wallet/DetailedFIATBalanceListItem.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import ControlContainer from '../components/common/controls/container/ControlContainer.vue'

const wallet = ref({})
const isLoading = ref(true)
const error = ref(null)
const showAddBalancePopup = ref(false)

const fetchWalletData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const walletIds = await fiatWalletService.getWalletIds()
    if (Array.isArray(walletIds) && walletIds.length > 0) {
      const response = await fiatWalletService.getWalletBalances(walletIds)
      wallet.value = response.wallet // We only need the first wallet as there's only one FIAT wallet
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch wallet details'
  } finally {
    isLoading.value = false
  }
}

const handleWalletChanged = () => {
  fetchWalletData()
}

const totalBalance = computed(() => {
  return wallet.value?.balances?.reduce((sum, balance) => sum + balance.balance, 0) || 0
})

onMounted(() => {
  fetchWalletData()
})
</script>
