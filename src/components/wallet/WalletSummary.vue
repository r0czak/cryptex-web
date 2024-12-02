<template>
  <div class="card bg-base-200 mb-8">
    <div class="card-body">
      <div class="mb-8">
        <h2 class="card-title text-2x">Total Balance</h2>
        <p class="font-mono text-4xl text-success mt-2">${{ formatBalance(totalBalance) }}</p>
      </div>
      <div
        class="bg-base-300 h-[300px] rounded-box flex items-center justify-center text-base-content/50"
      >
        <p class="text-center">Balance Graph - Coming Soon</p>
      </div>
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
