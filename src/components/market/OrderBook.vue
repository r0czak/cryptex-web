<template>
  <div class="card bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title text-lg mb-4">Order Book</h2>

      <!-- Sell Orders -->
      <div class="space-y-2 mb-4">
        <h3 class="text-sm font-semibold text-error">Sell Orders</h3>
        <div class="max-h-[200px] overflow-y-auto">
          <div
            v-for="order in sellOrders"
            :key="order.id"
            class="flex justify-between text-sm p-2 rounded bg-error/10 hover:bg-error/20"
          >
            <span>{{ formatPrice(order.price) }}</span>
            <span>{{ formatAmount(order.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- Spread indicator -->
      <div class="divider my-2">Spread: {{ calculateSpread() }}</div>

      <!-- Buy Orders -->
      <div class="space-y-2">
        <div class="max-h-[200px] overflow-y-auto">
          <div
            v-for="order in buyOrders"
            :key="order.id"
            class="flex justify-between text-sm p-2 rounded bg-success/10 hover:bg-success/20"
          >
            <span>{{ formatPrice(order.price) }}</span>
            <span>{{ formatAmount(order.amount) }}</span>
          </div>
        </div>
        <h3 class="text-sm font-semibold text-success mt-2">Buy Orders</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { marketService } from '../../services/market/market.service'

const props = defineProps({
  cryptocurrency: {
    type: String,
    required: true,
  },
})

const buyOrders = ref([])
const sellOrders = ref([])
const isLoading = ref(false)

const fetchOrderBook = async () => {
  if (!props.cryptocurrency) return

  isLoading.value = true
  try {
    const [buyResponse, sellResponse] = await Promise.all([
      marketService.getBuyOrders(props.cryptocurrency, 0, 20),
      marketService.getSellOrders(props.cryptocurrency, 0, 20),
    ])

    buyOrders.value = buyResponse.content
    sellOrders.value = sellResponse.content.reverse()
  } catch (error) {
    console.error('Error fetching order book:', error)
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price) => {
  return Number(price).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  })
}

const formatAmount = (amount) => {
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  })
}

const calculateSpread = () => {
  if (buyOrders.value.length > 0 && sellOrders.value.length > 0) {
    const highestBuyPrice = Math.max(...buyOrders.value.map((order) => order.price))
    const lowestSellPrice = Math.min(...sellOrders.value.map((order) => order.price))
    return (lowestSellPrice - highestBuyPrice).toFixed(2)
  }
  return 0
}

onMounted(() => {
  if (props.cryptocurrency) {
    fetchOrderBook()
  }
})

watch(() => props.cryptocurrency, fetchOrderBook)
</script>
