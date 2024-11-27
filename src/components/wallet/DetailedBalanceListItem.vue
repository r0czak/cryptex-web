<template>
  <div class="detailed-balance-item">
    <div class="crypto-info">
      <img :src="getCryptoIcon" :alt="cryptocurrencyName" class="crypto-icon" />
      <div class="crypto-details">
        <span class="crypto-name">{{ cryptocurrencyName }}</span>
        <div class="volume-info">
          <span class="volume">{{ formatBalance(balance) }} {{ cryptocurrencyName }}</span>
          <span class="price-per-unit">${{ formatBalance(pricePerUnit) }}/{{ cryptocurrencyName }}</span>
        </div>
      </div>
    </div>
    <div class="balance-info">
      <span class="dollar-balance">${{ formatBalance(totalInDollars) }}</span>
      <span class="percentage" :class="{ positive: changePercentage > 0, negative: changePercentage < 0 }">
        {{ changePercentage > 0 ? '+' : '' }}{{ changePercentage }}%
      </span>
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
