<template>
  <dialog :class="{ 'modal modal-open': props.isOpen }" id="create_wallet_modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Create new wallet</h3>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="form-control w-full">
          <input
            v-model="walletName"
            type="text"
            placeholder="Enter wallet name"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="modal-action flex justify-center">
          <button class="btn btn-success" type="submit">Create</button>
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
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'wallet-created'])
const walletName = ref('')

const handleSubmit = async () => {
  try {
    await cryptoWalletService.createWallet(walletName.value)
    emit('walletCreated')
    emit('close')
    walletName.value = ''
  } catch (error) {
    console.error('Error creating wallet:', error)
  }
}
</script>
