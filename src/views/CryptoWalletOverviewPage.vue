<template>
  <div class="p-8">
    <div v-if="isLoading" class="loading">Loading wallet...</div>

    <div v-else-if="error" class="error">
      <ErrorMessage title="Failed to load wallet" :message="error" :retryAction="fetchWalletData" />
    </div>

    <div class="v-else">
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-bold">{{ wallet.walletName }}</h1>
          <button class="btn btn-ghost" @click="showRenamePopup = true">
            <PencilIcon class="w-5 h-5" />
          </button>
        </div>
        <ControlContainer horizontal>
          <button class="btn btn-primary" @click="showAddCryptoBalancePopup = true">
            Add Balance
          </button>
          <button class="btn btn-error" @click="showDeletePopup = true">Delete Wallet</button>
        </ControlContainer>
      </div>

      <WalletSummary :crypto-balances="wallet.balances" />

      <div class="mt-10">
        <h2 class="text-xl font-bold mb-4">Your Cryptocurrencies</h2>
        <div class="balances-list">
          <DetailedBalanceListItem
            v-for="balance in wallet.balances"
            :key="balance.cryptocurrencyName"
            :cryptocurrencyName="balance.cryptocurrencyName"
            :cryptocurrencySymbol="balance.cryptocurrencySymbol"
            :balance="balance.balance"
            :paid-amount="balance.paidAmount"
          />
        </div>
      </div>
    </div>

    <Teleport to="body" v-if="wallet.cryptoWalletId">
      <RenameWalletPopup
        :is-open="showRenamePopup"
        :wallet-name="wallet.walletName || ''"
        :crypto-wallet-id="wallet.cryptoWalletId"
        @close="showRenamePopup = false"
        @renamed="handleWalletRenamed"
      />

      <AddCryptoBalancePopup
        :is-open="showAddCryptoBalancePopup"
        :crypto-wallet-id="wallet.cryptoWalletId"
        @close="showAddCryptoBalancePopup = false"
        @balance-added="handleWalletChanged"
      />

      <DeleteWalletPopup
        :is-open="showDeletePopup"
        :crypto-wallet-id="wallet.cryptoWalletId"
        :wallet-name="wallet.walletName || ''"
        @close="showDeletePopup = false"
        @wallet-deleted="handleWalletDeleted"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { cryptoWalletService } from '../services/crypto/cryptoWallet.service'

import RenameWalletPopup from '../components/wallet/RenameWalletPopup.vue'
import DeleteWalletPopup from '../components/wallet/DeleteWalletPopup.vue'
import AddCryptoBalancePopup from '../components/wallet/AddCryptoBalancePopup.vue'
import WalletSummary from '../components/wallet/WalletSummary.vue'
import DetailedBalanceListItem from '../components/wallet/DetailedBalanceListItem.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import ControlContainer from '../components/common/controls/container/ControlContainer.vue'

const router = useRouter()
const route = useRoute()
const wallet = ref({})
const isLoading = ref(true)
const error = ref(null)
const showRenamePopup = ref(false)
const showAddCryptoBalancePopup = ref(false)
const showDeletePopup = ref(false)

const fetchWalletData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await cryptoWalletService.getWalletBalances([route.params.id])
    wallet.value = response.wallets[0]
  } catch (err) {
    error.value = err.message || 'Failed to fetch wallet details'
  } finally {
    isLoading.value = false
  }
}

const handleWalletRenamed = (newName) => {
  wallet.value.walletName = newName
}

const handleWalletChanged = () => {
  fetchWalletData()
}

const handleWalletDeleted = () => {
  router.push('/crypto-wallets')
}

onMounted(() => {
  fetchWalletData()
})
</script>
