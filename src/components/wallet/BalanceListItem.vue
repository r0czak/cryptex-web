<template>
  <div class="flex justify-between items-center bg-neutral p-3 m-2 rounded-xl">
    <div class="flex items-center gap-4">
      <img :src="getCryptoIcon" :alt="cryptocurrencyName" class="w-10 h-10" />
      <span class="text-l font-bold">{{ cryptocurrencyName }}</span>
    </div>
    <span class="text-l text-success">{{ formatBalance(balance) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
