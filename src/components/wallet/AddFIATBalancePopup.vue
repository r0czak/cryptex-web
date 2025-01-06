<template>
  <dialog :class="{ 'modal modal-open': props.isOpen }" id="add_fiat_balance_modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Add FIAT Balance</h3>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="form-control w-full mb-4">
          <select v-model="selectedFiat" class="select select-bordered w-full" required>
            <option disabled value="">Select currency</option>
            <option
              v-for="currency in fiatCurrencies"
              :key="currency.value"
              :value="currency.value"
            >
              {{ currency.label }}
            </option>
          </select>
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
import { fiatWalletService } from '../../services/fiat/fiatWallet.service'

const props = defineProps({
  fiatWalletId: {
    type: Number,
    required: true,
    default: 0,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'balance-added'])
const selectedFiat = ref('')
const amount = ref(0)
const displayAmount = ref('')

const fiatCurrencies = [{ value: 'USD', label: 'US Dollar (USD)' }]

const isValidAmount = computed(() => {
  if (!displayAmount.value) return true
  return /^\d*\.?\d{0,2}$/.test(displayAmount.value) && parseFloat(displayAmount.value) > 0
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
      if (decimal && decimal.length >= 2) event.preventDefault()
    }
    return
  }

  // Prevent any other input
  event.preventDefault()
}

const handleAmountInput = (event) => {
  const value = event.target.value
  // Allow empty input or valid float with up to 2 decimal places
  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
    displayAmount.value = value
    amount.value = parseFloat(value) || 0
  }
}

const handleSubmit = async () => {
  try {
    if (!selectedFiat.value) {
      throw new Error('Please select a currency')
    }

    if (!isValidAmount.value) {
      throw new Error('Please enter a valid amount')
    }

    await fiatWalletService.deposit(props.fiatWalletId, selectedFiat.value, amount.value)
    emit('balance-added')
    emit('close')
    selectedFiat.value = ''
    amount.value = 0
    displayAmount.value = ''
  } catch (error) {
    console.error('Error adding balance:', error)
  }
}
</script>
