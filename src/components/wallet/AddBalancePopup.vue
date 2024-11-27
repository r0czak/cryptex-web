<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <h2>Add Balance</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <div class="input-wrapper">
            <CustomSelect v-model="selectedCrypto" :options="cryptocurrencies" />
          </div>
        </div>
        <div class="form-group">
          <div class="input-wrapper">
            <input
              id="amount"
              v-model="displayAmount"
              type="text"
              required
              @input="handleAmountInput"
              placeholder="Enter amount"
              class="input-field"
            />
          </div>
        </div>
        <div class="button-group">
          <button class="cancel-button" type="button" @click="$emit('close')">Cancel</button>
          <button class="submit-button" type="submit">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'
import CustomSelect from '../common/CustomSelect.vue'

const props = defineProps({
  cryptoWalletId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close', 'balance-added'])
const selectedCrypto = ref('')
const amount = ref(0)
const displayAmount = ref('')

const cryptocurrencies = [
  { value: 'bitcoin', label: 'Bitcoin', symbol: 'BTC' },
  { value: 'ethereum', label: 'Ethereum', symbol: 'ETH' },
  { value: 'litecoin', label: 'Litecoin', symbol: 'LTC' },
]

const handleAmountInput = (event) => {
  const value = event.target.value
  // Allow only numbers and decimal point
  if (/^\d*\.?\d*$/.test(value)) {
    displayAmount.value = value
    amount.value = parseFloat(value) || 0
  }
}

const handleSubmit = async () => {
  try {
    const selectedCurrency = cryptocurrencies.find(
      (crypto) => crypto.value === selectedCrypto.value
    )
    if (!selectedCurrency) {
      throw new Error('Please select a cryptocurrency')
    }

    const request = {
      cryptoWalletId: props.cryptoWalletId,
      symbol: selectedCurrency.symbol,
      amount: amount.value,
    }

    await cryptoWalletService.deposit(request)
    emit('balance-added')
    emit('close')
    selectedCrypto.value = ''
    amount.value = 0
    displayAmount.value = ''
  } catch (error) {
    console.error('Error adding balance:', error)
  }
}
</script>
