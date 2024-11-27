<template>
  <div v-if="isOpen" class="popup-overlay">
    <div class="popup-content">
      <h2>Create New Wallet</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <div class="input-wrapper">
            <input
              id="walletName"
              v-model="walletName"
              type="text"
              required
              placeholder="Enter wallet name"
              class="input-field"
            />
          </div>
        </div>
        <div class="button-group">
          <button class="submit-button" type="submit">Create</button>
          <button class="cancel-button" type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'

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
