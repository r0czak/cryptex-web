<template>
  <div class="p-8">
    <div v-if="isLoading" class="loading">Loading wallet...</div>

    <div v-else-if="error" class="error">
      <ErrorMessage title="Failed to load wallet" :message="error" :retryAction="fetchWalletData" />
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-bold">{{ wallet.walletName }}</h1>
          <button class="btn btn-ghost" @click="showRenamePopup = true">
            <PencilIcon class="w-5 h-5" />
          </button>
        </div>
        <button class="btn btn-primary" @click="showAddBalancePopup = true">Add Balance</button>
      </div>

      <WalletSummary :total-balance="totalBalance" />

      <div class="mt-10">
        <h2 class="text-xl font-bold mb-4">Your Cryptocurrencies</h2>
        <div class="balances-list">
          <DetailedBalanceListItem
            v-for="balance in wallet.balances"
            :key="balance.cryptocurrencyName"
            :cryptocurrencyName="balance.cryptocurrencyName"
            :cryptocurrencySymbol="balance.cryptocurrencySymbol"
            :balance="balance.balance"
            :price-per-unit="balance.pricePerUnit"
            :change-percentage="balance.changePercentage"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <RenameWalletPopup
        :is-open="showRenamePopup"
        :wallet-name="wallet.walletName"
        @close="showRenamePopup = false"
        @renamed="handleWalletRenamed"
      />

      <AddBalancePopup
        :is-open="showAddBalancePopup"
        :crypto-wallet-id="wallet.cryptoWalletId"
        @close="showAddBalancePopup = false"
        @balance-added="handleBalanceAdded"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { cryptoWalletService } from '../services/crypto/cryptoWallet.service'
import { cryptoPriceService } from '../services/crypto/cryptoPrice.service'
import RenameWalletPopup from '../components/wallet/RenameWalletPopup.vue'
import AddBalancePopup from '../components/wallet/AddBalancePopup.vue'
import WalletSummary from '../components/wallet/WalletSummary.vue'
import DetailedBalanceListItem from '../components/wallet/DetailedBalanceListItem.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'

const route = useRoute()
const wallet = ref({})
const isLoading = ref(true)
const error = ref(null)
const showRenamePopup = ref(false)
const showAddBalancePopup = ref(false)

const fetchWalletData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await cryptoWalletService.getWalletBalances([route.params.id])
    wallet.value = response.wallets[0]
    for (const balance of wallet.value.balances) {
      const response = await cryptoPriceService.getPrice(balance.cryptocurrencySymbol)
      balance.pricePerUnit = response.calculatedPrice
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch wallet details'
  } finally {
    isLoading.value = false
  }
}

const handleWalletRenamed = (newName) => {
  wallet.value.walletName = newName
}

const handleBalanceAdded = () => {
  fetchWalletData()
}

const totalBalance = computed(() => {
  return (
    wallet.value.balances?.reduce((sum, balance) => {
      return sum + balance.balance * balance.pricePerUnit
    }, 0) || 0
  )
})

onMounted(() => {
  fetchWalletData()
})
</script>
