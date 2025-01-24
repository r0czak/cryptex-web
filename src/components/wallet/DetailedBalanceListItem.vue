<template>
  <div class="card bg-base-200 mb-4">
    <div class="card-body p-6 flex-row justify-between items-center">
      <div class="flex items-center gap-4">
        <img :src="getCryptoIcon" :alt="cryptocurrencyName" class="w-10 h-10" />
        <div class="flex flex-col gap-1">
          <span class="font-mono text-lg font-bold">{{ cryptocurrencyName }}</span>
          <div class="flex flex-col text-sm opacity-80">
            <span class="text-white">{{ formatBalance(balance) }} {{ cryptocurrencyName }}</span>
            <span class="text-xs"
              >${{ formatFiatBalance(pricePerUnit) }}/{{ cryptocurrencyName }}</span
            >
          </div>
        </div>
      </div>
      <div class="text-right">
        <span class="block font-mono text-xl mb-1">${{ formatFiatBalance(totalBalance) }}</span>
        <span
          class="badge"
          v-if="changePercentage"
          :class="{
            'badge-success': changePercentage > 0,
            'badge-error': changePercentage < 0,
            'badge-ghost': changePercentage === 0,
          }"
        >
          {{ changePercentage > 0 ? '+' : '' }}{{ changePercentage }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { vwapService } from '../../services/crypto/vwapHistory.service'

const props = defineProps({
  cryptocurrencyName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
})

const totalBalance = ref(0)
const pricePerUnit = ref(0)
const changePercentage = ref(0)

const getCryptoIcon = computed(() => {
  try {
    // Using dynamic import for SVG files
    return new URL(
      `../../assets/images/crypto/logos/${props.cryptocurrencyName.toLowerCase()}-${getSymbol(
        props.cryptocurrencyName
      ).toLowerCase()}-logo.svg`,
      import.meta.url
    ).href
  } catch (error) {
    console.warn(`Failed to load icon for ${props.cryptocurrencyName}`, error)
    // Fallback to Bitcoin icon if the specific crypto icon is not found
    return new URL(`../../assets/images/crypto/logos/bitcoin-btc-logo.svg`, import.meta.url).href
  }
})

const formatFiatBalance = (value) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const calculateTotalBalance = async () => {
  try {
    const response = await vwapService.getCurrentVWAP({
      cryptoSymbol: getSymbol(props.cryptocurrencyName),
      fiatSymbol: 'USD',
      interval: 'FIFTEEN_MINUTES',
    })
    pricePerUnit.value = response.vwap
    totalBalance.value = props.balance * response.vwap
    changePercentage.value = (
      ((totalBalance.value - props.paidAmount) / props.paidAmount) *
      100
    ).toFixed(2)
  } catch (error) {
    console.error('Error calculating total balance:', error)
  }
}

let balanceUpdateInterval

onMounted(() => {
  calculateTotalBalance()
  balanceUpdateInterval = setInterval(calculateTotalBalance, 1 * 60 * 1000)
})

onUnmounted(() => {
  if (balanceUpdateInterval) {
    clearInterval(balanceUpdateInterval)
  }
})

const getSymbol = (cryptoName) => {
  cryptoName = cryptoName.toLowerCase()
  const symbolMap = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    litecoin: 'LTC',
  }
  return symbolMap[cryptoName] || 'BTC'
}

const formatBalance = (value) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}
</script>
