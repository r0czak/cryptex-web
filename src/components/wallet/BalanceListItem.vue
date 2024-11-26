<template>
  <div class="balance-list-item">
    <div class="crypto-info">
      <img :src="getCryptoIcon" :alt="cryptocurrency" class="crypto-icon" />
      <span class="crypto-name">{{ cryptocurrency }}</span>
    </div>
    <span class="balance-amount">{{ formatBalance(balance) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cryptocurrency: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
})

const getCryptoIcon = computed(() => {
  const iconName = props.cryptocurrency.toLowerCase()
  try {
    // Using dynamic import for SVG files
    return new URL(
      `../../assets/images/crypto/logos/${iconName}-${getSymbol(props.cryptocurrency)}-logo.svg`,
      import.meta.url
    ).href
  } catch (error) {
    console.warn(`Failed to load icon for ${props.cryptocurrency}`, error)
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
