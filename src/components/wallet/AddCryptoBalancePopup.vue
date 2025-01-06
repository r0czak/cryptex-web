<template>
  <dialog :class="{ 'modal modal-open': props.isOpen }" id="add_crypto_balance_modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Add Crypto Balance</h3>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="form-control w-full mb-4">
          <CustomSelect
            v-model="selectedCrypto"
            :options="cryptocurrencies"
            placeholder="Select cryptocurrency"
            required
          />
        </div>
        <div class="form-control w-full">
          <input
            v-model="displayAmount"
            type="text"
            inputmode="decimal"
            placeholder="Enter amount"
            class="input input-bordered w-full"
            :class="{ 'input-error': !isValidAmount }"
            required
            @input="handleAmountInput"
            @keypress="validateKeyPress"
          />
          <label v-if="!isValidAmount" class="label">
            <span class="label-text-alt text-error">Please enter a valid number</span>
          </label>
        </div>
        <div class="modal-action flex justify-center">
          <button class="btn btn-success" type="submit" :disabled="!isValidAmount">Add</button>
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
import { ref, computed } from 'vue'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'
import CustomSelect from '../common/CustomSelect.vue'

const props = defineProps({
  cryptoWalletId: {
    type: Number,
    required: true,
  },
  isOpen: {
    type: Boolean,
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

const isValidAmount = computed(() => {
  if (!displayAmount.value) return true
  return /^\d*\.?\d{0,8}$/.test(displayAmount.value) && parseFloat(displayAmount.value) > 0
})

const validateKeyPress = (event) => {
  // Allow: backspace, delete, tab, escape, enter, decimal point
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.']
  if (allowedKeys.includes(event.key)) return

  // Allow numbers
  if (/^\d$/.test(event.key)) {
    // Prevent multiple decimal points
    if (displayAmount.value.includes('.')) {
      const [, decimal] = displayAmount.value.split('.')
      if (decimal && decimal.length >= 8) event.preventDefault()
    }
    return
  }

  // Prevent any other input
  event.preventDefault()
}

const handleAmountInput = (event) => {
  const value = event.target.value
  // Allow empty input or valid float with up to 8 decimal places
  if (value === '' || /^\d*\.?\d{0,8}$/.test(value)) {
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

    if (!isValidAmount.value) {
      throw new Error('Please enter a valid amount')
    }

    await cryptoWalletService.deposit(props.cryptoWalletId, selectedCrypto.value, amount.value)
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
