<template>
  <dialog :class="{ 'modal modal-open': props.isOpen }" id="add_balance_modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Add Balance</h3>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="form-control w-full mb-4">
          <CustomSelect v-model="selectedCrypto" :options="cryptocurrencies" />
        </div>
        <div class="form-control w-full">
          <input
            v-model="displayAmount"
            type="text"
            placeholder="Enter amount"
            class="input input-bordered w-full"
            required
            @input="handleAmountInput"
          />
        </div>
        <div class="modal-action flex justify-center">
          <button class="btn btn-success" type="submit">Add</button>
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

const handleAmountInput = (event) => {
  const value = event.target.value
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
