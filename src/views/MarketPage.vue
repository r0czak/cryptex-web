<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Market</h1>
      <div class="flex gap-4">
        <select v-model="selectedCrypto" class="select select-bordered">
          <option
            v-for="crypto in cryptocurrencies"
            :key="crypto.cryptoSymbol"
            :value="crypto.cryptoSymbol"
          >
            {{ crypto.cryptoSymbol }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Chart Section (3 columns) -->
      <div class="lg:col-span-3">
        <div class="card bg-base-200">
          <div class="card-body">
            <MarketChart :cryptocurrency="selectedCrypto" />
          </div>
        </div>
      </div>

      <!-- Orderbook Section (1 column) -->
      <div class="lg:col-span-1">
        <OrderBook :cryptocurrency="selectedCrypto" />
      </div>

      <!-- Trading Controls Section (full width) -->
      <div class="lg:col-span-4">
        <TradingControls :cryptocurrency="selectedCrypto" @order-created="handleOrderCreated" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarketChart from '../components/market/MarketChart.vue'
import OrderBook from '../components/market/OrderBook.vue'
import TradingControls from '../components/market/TradingControls.vue'
import { apiService } from '../services/api.service'

const selectedCrypto = ref('BTC')
const cryptocurrencies = ref([])

const fetchCryptocurrencies = async () => {
  const response = await apiService.cryptocurrency.getCryptocurrencies()
  cryptocurrencies.value = response.data
  if (!selectedCrypto.value && cryptocurrencies.value.length > 0) {
    selectedCrypto.value = cryptocurrencies.value[0].cryptoSymbol
  }
}

const handleOrderCreated = () => {
  // TODO: Handle order creation success
}

onMounted(() => {
  fetchCryptocurrencies()
})
</script>

<style>
/* Base input styling */
.dp__theme_dark {
  --dp-background-color: oklch(var(--b1));
  --dp-text-color: oklch(var(--t1))
  --dp-font-family: var(--font-mono);
  --dp-font-size: 0.875rem;
  --dp-hover-color: oklch(var(--b3));
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: oklch(var(--p));
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  --dp-highlight-color: rgb(0 92 178 / 20%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
  --dp-range-between-border-color: var(--dp-hover-color, #fff);
}
</style>
