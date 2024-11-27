<template>
  <div class="wallet-overview-page">
    <div v-if="isLoading" class="loading">Loading wallet...</div>

    <div v-else-if="error" class="error">
      <ErrorMessage title="Failed to load wallet" :message="error" :retryAction="fetchWalletData" />
    </div>

    <div v-else>
      <div class="header">
        <div class="wallet-title">
          <h1>{{ wallet.walletName }}</h1>
          <button class="icon-button" @click="showRenamePopup = true">
            <PencilIcon class="icon" />
          </button>
        </div>
        <button class="basic-button" @click="showAddBalancePopup = true">Add Balance</button>
      </div>

      <WalletSummary :total-balance="totalBalance" />

      <div class="balances-section">
        <h2>Your Cryptocurrencies</h2>
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
        v-if="showRenamePopup"
        :wallet-name="wallet.walletName"
        @close="showRenamePopup = false"
        @renamed="handleWalletRenamed"
      />

      <AddBalancePopup
        v-if="showAddBalancePopup"
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

<style scoped>
.wallet-overview-page {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.wallet-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.icon {
  width: 20px;
  height: 20px;
  color: #999;
}

.balances-section {
  margin-top: 2rem;
}

.balances-section h2 {
  margin-bottom: 1.5rem;
}
</style>
