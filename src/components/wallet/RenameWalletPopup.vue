<template>
  <dialog :class="{ 'modal modal-open': props.isOpen }" id="rename_wallet_modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Rename Wallet</h3>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="form-control w-full">
          <input
            v-model="newWalletName"
            type="text"
            placeholder="Enter new wallet name"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="modal-action flex justify-center">
          <button class="btn btn-success" type="submit">Rename</button>
          <button class="btn btn-error" type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'

const props = defineProps({
  walletName: {
    type: String,
    required: true,
  },
  cryptoWalletId: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'renamed'])
const newWalletName = ref(props.walletName)

const handleSubmit = async () => {
  try {
    await cryptoWalletService.renameWallet(props.cryptoWalletId, newWalletName.value)
    emit('renamed', newWalletName.value)
    emit('close')
  } catch (error) {
    console.error('Error renaming wallet:', error)
  }
}
</script>
