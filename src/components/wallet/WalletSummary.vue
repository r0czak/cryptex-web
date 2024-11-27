<template>
  <div class="wallet-summary">
    <div class="total-balance">
      <h2>Total Balance</h2>
      <p class="balance-amount">${{ formatBalance(totalBalance) }}</p>
    </div>
    <div class="graph-placeholder">
      <p>Balance Graph - Coming Soon</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalBalance: {
    type: Number,
    required: true,
  },
})

const formatBalance = (value) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>
