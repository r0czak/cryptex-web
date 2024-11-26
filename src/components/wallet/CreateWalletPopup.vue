<template>
  <div v-if="isOpen" class="popup-overlay">
    <div class="popup-content">
      <h2>Create New Wallet</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="walletName">Wallet Name:</label>
          <input id="walletName" v-model="walletName" type="text" required placeholder="Enter wallet name" />
        </div>
        <div class="button-group">
          <button type="submit" class="submit-btn">Create</button>
          <button type="button" @click="$emit('close')" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
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

const emit = defineEmits(['close', 'walletCreated'])
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

<style scoped></style>
