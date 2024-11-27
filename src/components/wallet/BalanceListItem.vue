<template>
  <div class="balance-list-item">
    <div class="balance-list-crypto-info">
      <img :src="getCryptoIcon" :alt="cryptocurrencyName" class="balance-list-crypto-icon" />
      <span class="balance-list-crypto-name">{{ cryptocurrencyName }}</span>
    </div>
    <span class="balance-list-amount">{{ formatBalance(balance) }}</span>
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
