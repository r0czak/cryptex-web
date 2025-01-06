<template>
  <div class="card bg-base-200 mb-4">
    <div class="card-body p-6 flex-row justify-between items-center">
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 flex items-center justify-center bg-primary rounded-full text-primary-content font-bold text-xl"
        >
          $
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-mono text-lg font-bold">{{ props.currencyName }}</span>
          <div class="flex flex-col text-sm opacity-80">
            <span>{{ formatBalance(props.balance) }} {{ props.currencySymbol }}</span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <span class="block font-mono text-xl mb-1">${{ formatBalance(props.balance) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currencyName: {
    type: String,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
  },
  balance: {
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
