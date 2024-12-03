<template>
  <dialog :class="{ 'modal modal-open': props.isOpen }" id="delete_wallet_modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center text-error">Delete Wallet</h3>
      <div class="mt-4 space-y-4">
        <p class="text-center">
          Are you sure you want to delete "{{ props.walletName }}"? This action cannot be undone.
        </p>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Transfer funds to:</span>
          </label>
          <select v-model="selectedTargetWallet" class="select select-bordered w-full" required>
            <option disabled value="">Select a wallet</option>
            <option
              v-for="wallet in availableWallets"
              :key="wallet.cryptoWalletId"
              :value="wallet.cryptoWalletId"
            >
              {{ wallet.walletName }}
            </option>
          </select>
        </div>

        <div class="modal-action flex justify-center gap-2">
          <button
            class="btn btn-error"
            :disabled="!selectedTargetWallet || isProcessing"
            @click="handleDelete"
          >
            <span v-if="isProcessing" class="loading loading-spinner"></span>
            delete wallet
          </button>
          <button class="btn btn-ghost" @click="$emit('close')" :disabled="isProcessing">
            cancel
          </button>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  walletName: {
    type: String,
    required: true,
  },
  cryptoWalletId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'wallet-deleted'])

const selectedTargetWallet = ref('')
const availableWallets = ref([])
const isProcessing = ref(false)

const fetchAvailableWallets = async () => {
  try {
    const walletIds = await cryptoWalletService.getWalletIds()
    const response = await cryptoWalletService.getWalletBalances(walletIds)
    // Filter out the current wallet
    availableWallets.value = response.wallets.filter(
      (wallet) => wallet.cryptoWalletId !== props.cryptoWalletId
    )
  } catch (error) {
    console.error('Error fetching available wallets:', error)
  }
}

const handleDelete = async () => {
  if (!selectedTargetWallet.value) return

  isProcessing.value = true
  try {
    await cryptoWalletService.deleteWallet(props.cryptoWalletId, selectedTargetWallet.value)
    emit('wallet-deleted')
    emit('close')
  } catch (error) {
    console.error('Error deleting wallet:', error)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  fetchAvailableWallets()
})
</script>
