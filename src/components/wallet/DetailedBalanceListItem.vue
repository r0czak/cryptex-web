<template>
  <div class="card bg-base-200 mb-4">
    <div class="card-body p-6 flex-row justify-between items-center">
      <div class="flex items-center gap-4">
        <img :src="getCryptoIcon" :alt="cryptocurrencyName" class="w-10 h-10" />
        <div class="flex flex-col gap-1">
          <span class="font-mono text-lg font-bold">{{ cryptocurrencyName }}</span>
          <div class="flex flex-col text-sm opacity-80">
            <span>{{ formatBalance(balance) }} {{ cryptocurrencyName }}</span>
            <span>${{ formatBalance(pricePerUnit) }}/{{ cryptocurrencyName }}</span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <span class="block font-mono text-xl mb-1">${{ formatBalance(totalInDollars) }}</span>
        <span
          class="badge"
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
import { computed } from 'vue'
const totalInDollars = computed(() => props.balance * props.pricePerUnit)

const props = defineProps({
  cryptocurrencyName: {
    type: String,
    required: true,
  },
  cryptocurrencySymbol: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  changePercentage: {
    type: Number,
    required: true,
  },
})

const getCryptoIcon = computed(() => {
  const iconName = props.cryptocurrencyName.toLowerCase()
  try {
    // Using dynamic import for SVG files
    return new URL(
      `../../assets/images/crypto/logos/${iconName}-${getSymbol(
        props.cryptocurrencyName
      )}-logo.svg`,
      import.meta.url
    ).href
  } catch (error) {
    console.warn(`Failed to load icon for ${props.cryptocurrencyName}`, error)
    // Fallback to Bitcoin icon if the specific crypto icon is not found
    return new URL(`../../assets/images/crypto/logos/bitcoin-btc-logo.svg`, import.meta.url).href
  }
})

const getSymbol = (cryptoName) => {
  const symbolMap = {
    bitcoin: 'btc',
    ethereum: 'eth',
    litecoin: 'ltc',
  }
  return symbolMap[cryptoName.toLowerCase()] || 'btc'
}

const formatBalance = (value) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}
</script>
