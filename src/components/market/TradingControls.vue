<template>
  <div class="card bg-base-200">
    <div class="card-body">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold">Create Order</h3>
        <span class="flex justify-between text-sm p-2 rounded bg-success/10 hover:bg-success/20">
          Available crypto: {{ selectedWalletBalance }} {{ cryptocurrency }}
        </span>
        <span class="flex justify-between text-sm p-2 rounded bg-success/10 hover:bg-success/20">
          Available fiat: {{ formatBalance(fiatWallet?.balances[0]?.balance) }} {{ 'USD' }}
        </span>
        <div class="tabs tabs-boxed">
          <a class="tab" :class="{ 'tab-active': orderType === 'BUY' }" @click="orderType = 'BUY'"
            >Buy</a
          >
          <a class="tab" :class="{ 'tab-active': orderType === 'SELL' }" @click="orderType = 'SELL'"
            >Sell</a
          >
        </div>
      </div>

      <form @submit.prevent="createOrder" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ orderType === 'SELL' ? 'From' : 'To' }} Crypto Wallet</span>
          </label>
          <select
            v-model="selectedCryptoWalletId"
            class="select select-bordered"
            required
            @change="handleCryptoWalletSelect"
          >
            <option value="" disabled>Select a wallet</option>
            <option v-for="wallet in availableWallets" :key="wallet.id" :value="wallet.id">
              {{ wallet.walletName }}
            </option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Amount ({{ cryptocurrency }})</span>
            <button
              v-if="orderType === 'SELL' && selectedWalletBalance"
              type="button"
              class="label-text-alt btn btn-xs btn-ghost"
              @click="useMaxAmount"
            >
              Use max
            </button>
          </label>
          <input
            v-model="order.amount"
            type="text"
            inputmode="decimal"
            class="input input-bordered"
            :class="{ 'input-error': !isValidAmount }"
            required
            @input="handleAmountInput"
            @keypress="validateKeyPress"
          />
          <label v-if="!isValidAmount" class="label">
            <span class="label-text-alt text-error">Please enter a valid amount</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Price per unit (USD)</span>
            <button
              type="button"
              class="label-text-alt btn btn-xs btn-ghost"
              @click="useMarketPrice"
            >
              Use market price
            </button>
          </label>
          <input
            v-model="order.price"
            type="text"
            inputmode="decimal"
            class="input input-bordered"
            :class="{ 'input-error': !isValidPrice }"
            required
            @input="handlePriceInput"
            @keypress="validatePriceKeyPress"
          />
          <label v-if="!isValidPrice" class="label">
            <span class="label-text-alt text-error">Please enter a valid price</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Total (USD)</span>
          </label>
          <input :value="calculateTotal" type="text" class="input input-bordered" disabled />
        </div>

        <button
          type="submit"
          class="btn w-full"
          :class="orderType === 'BUY' ? 'btn-success' : 'btn-error'"
          :disabled="!isFormValid"
        >
          Place {{ orderType === 'BUY' ? 'Buy' : 'Sell' }} Order
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { marketService } from '../../services/market/market.service'
import { cryptoWalletService } from '../../services/crypto/cryptoWallet.service'
import { fiatWalletService } from '../../services/fiat/fiatWallet.service'

const props = defineProps({
  cryptocurrency: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['order-created'])

const orderType = ref('BUY')
const order = ref({
  amount: '',
  price: '',
})
const cryptoWallets = ref([])
const fiatWallet = ref(null)
const selectedCryptoWalletId = ref('')
const selectedCryptoWallet = ref(null)

// Input validation patterns from AddCryptoBalancePopup and AddFIATBalancePopup
const isValidAmount = computed(() => {
  if (!order.value.amount) return true
  return /^\d*\.?\d{0,8}$/.test(order.value.amount) && parseFloat(order.value.amount) > 0
})

const isValidPrice = computed(() => {
  if (!order.value.price) return true
  return /^\d*\.?\d{0,2}$/.test(order.value.price) && parseFloat(order.value.price) > 0
})

const formState = computed(() => ({
  amount: order.value.amount,
  price: order.value.price,
  orderType: orderType.value,
  fiatBalance: fiatWallet.value?.balances?.[0]?.balance,
  cryptoBalance: selectedCryptoWallet.value ? getWalletBalance(selectedCryptoWallet.value) : 0,
}))

const isFormValid = computed(() => {
  // Make isFormValid depend on formState
  const state = formState.value
  console.log(state)

  // Basic form validation
  if (!selectedCryptoWallet.value || !state.amount || !state.price) {
    return false
  }
  console.log('1')

  // Input format validation
  const amount = parseFloat(state.amount)
  const price = parseFloat(state.price)

  if (!amount || !price || amount <= 0 || price <= 0) {
    return false
  }
  console.log('2')

  const total = amount * price

  // For sell orders, check crypto balance
  if (state.orderType === 'SELL') {
    if (amount > state.cryptoBalance) {
      return false
    }
  }
  console.log('3')

  // For buy orders, check fiat balance
  if (state.orderType === 'BUY') {
    if (!state.fiatBalance) {
      return false
    }
    return total <= state.fiatBalance
  }
  console.log('4')
  return true
})

const availableWallets = computed(() => {
  return cryptoWallets.value.filter((wallet) => {
    if (orderType.value === 'SELL') {
      return getWalletBalance(wallet) > 0
    }
    return true
  })
})

const selectedWalletBalance = computed(() => {
  return selectedCryptoWallet.value
    ? formatBalance(getWalletBalance(selectedCryptoWallet.value))
    : '0'
})

const calculateTotal = computed(() => {
  if (!order.value.amount || !order.value.price) return '$0.00'
  const total = Number(order.value.amount) * Number(order.value.price)
  return total.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
})

// Reuse validation logic from AddCryptoBalancePopup
const validateKeyPress = (event) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.']
  if (allowedKeys.includes(event.key)) return

  if (/^\d$/.test(event.key)) {
    if (order.value.amount.includes('.')) {
      const [, decimal] = order.value.amount.split('.')
      if (decimal && decimal.length >= 8) event.preventDefault()
    }
    return
  }
  event.preventDefault()
}

const validatePriceKeyPress = (event) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.']
  if (allowedKeys.includes(event.key)) return

  if (/^\d$/.test(event.key)) {
    if (order.value.price.includes('.')) {
      const [, decimal] = order.value.price.split('.')
      if (decimal && decimal.length >= 2) event.preventDefault()
    }
    return
  }
  event.preventDefault()
}

const handleAmountInput = (event) => {
  const value = event.target.value
  if (value === '' || /^\d*\.?\d{0,8}$/.test(value)) {
    order.value.amount = value
  }
}

const handlePriceInput = (event) => {
  const value = event.target.value
  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
    order.value.price = value
  }
}

const handleCryptoWalletSelect = (event) => {
  selectedCryptoWallet.value = cryptoWallets.value.find(
    (wallet) => wallet.walletName === event.target.value
  )
  console.log(selectedCryptoWallet.value)
}

const getWalletBalance = (wallet) => {
  console.log(wallet)
  const balance = wallet.balances.find((b) => b.cryptocurrencySymbol === props.cryptocurrency)
  return balance ? balance.balance : 0
}

const formatBalance = (value) => {
  // Convert to string with maximum precision
  const formattedValue = Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
    useGrouping: true,
  })

  // Remove trailing zeros after decimal point
  if (formattedValue.includes('.')) {
    return formattedValue.replace(/\.?0+$/, '')
  }

  return formattedValue
}

const getMaxSellAmount = () => {
  return selectedCryptoWallet.value ? getWalletBalance(selectedCryptoWallet.value) : 0
}

const useMarketPrice = async () => {
  try {
    const response = await marketService[
      orderType.value === 'BUY' ? 'getSellOrders' : 'getBuyOrders'
    ](props.cryptocurrency, 0, 1)
    if (response.content.length > 0) {
      order.value.price = Number(response.content[0].price).toFixed(2)
    }
  } catch (error) {
    console.error('Error fetching market price:', error)
  }
}

const useMaxAmount = () => {
  order.value.amount = getMaxSellAmount().toString()
}

const fetchWallets = async () => {
  try {
    const [cryptoResponse, fiatResponse] = await Promise.all([
      cryptoWalletService.getCryptoWallets(),
      fiatWalletService.getFiatWallets(),
    ])
    cryptoWallets.value = cryptoResponse.wallets
    fiatWallet.value = fiatResponse.wallet
  } catch (error) {
    console.error('Error fetching wallets:', error)
  }
}

const createOrder = async () => {
  try {
    await marketService.placeOrder({
      type: orderType.value,
      cryptoSymbol: props.cryptocurrency,
      fiatSymbol: 'USD',
      amount: order.value.amount,
      price: order.value.price,
      cryptoWalletId: selectedCryptoWallet.value.cryptoWalletId,
      fiatWalletId: fiatWallet.value.fiatWalletId,
    })
    order.value = { amount: '', price: '' }
    emit('order-created')
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

onMounted(fetchWallets)
</script>
