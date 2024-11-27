<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <h2>Rename Wallet</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="walletName">New Wallet Name:</label>
          <div class="input-wrapper">
            <input
              id="walletName"
              v-model="newWalletName"
              type="text"
              required
              placeholder="Enter new wallet name"
              class="input-field"
            />
          </div>
        </div>
        <div class="button-group">
          <button class="submit-button" type="submit">Rename</button>
          <button class="cancel-button" type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'

const props = defineProps({
  walletName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'renamed'])
const newWalletName = ref(props.walletName)

const handleSubmit = async () => {
  try {
    await cryptoWalletService.renameWallet(newWalletName.value)
    emit('renamed', newWalletName.value)
    emit('close')
  } catch (error) {
    console.error('Error renaming wallet:', error)
  }
}
</script>
