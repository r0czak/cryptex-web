<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Current Price</div>
          <div class="stat-value">{{ currentPrice }}</div>
        </div>
      </div>
    </div>

    <div class="bg-base-300 rounded-box p-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <select
          v-model="selectedInterval"
          class="select select-bordered select-sm w-full sm:w-auto"
        >
          <option v-for="interval in Object.values(TimeInterval)" :value="interval" :key="interval">
            {{ interval }}
          </option>
        </select>

        <div class="w-full sm:w-[320px]">
          <Datepicker
            v-model="dateTimeRange"
            :range="true"
            :preset-dates="presetDates"
            :dark="true"
            class="w-full sm:w-[300px]"
          >
            <template #preset-date-range-button="{ label, value, presetDate }">
              <span
                role="button"
                :tabindex="0"
                @click="presetDate(value)"
                @keyup.enter.prevent="presetDate(value)"
                @keyup.space.prevent="presetDate(value)"
              >
                {{ label }}
              </span>
            </template>
          </Datepicker>
        </div>
      </div>

      <div class="h-[400px] relative">
        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center bg-base-300/50 z-10"
        >
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div ref="chartContainer" class="h-full w-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { createChart } from 'lightweight-charts'
import { TimeInterval } from '../../types/TimeInterval'
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths } from 'date-fns'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { vwapService } from '../../services/crypto/vwapHistory.service'

const props = defineProps({
  cryptocurrency: {
    type: String,
    required: true,
  },
})

const chartContainer = ref(null)
let chart = null
let candlestickSeries = null

const currentPrice = ref(null)
const dateTimeRange = ref([new Date(new Date().setHours(new Date().getHours() - 1)), new Date()])
const isLoading = ref(false)
const selectedInterval = ref(TimeInterval.FIFTEEN_MINUTES)

const presetDates = ref([
  { label: 'One hour', value: [new Date().setHours(new Date().getHours() - 1), new Date()] },
  { label: 'Today', value: [new Date().setHours(0, 0, 0, 0), new Date()] },
  { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] },
])

const initChart = () => {
  if (chart) {
    chart.remove()
  }

  chart = createChart(chartContainer.value, {
    layout: {
      background: { color: 'transparent' },
      textColor: 'rgba(255, 255, 255, 0.5)',
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      tickMarkFormatter: (time) => {
        const date = new Date(time * 1000)
        const interval = selectedInterval.value

        if (
          interval === TimeInterval.ONE_MINUTE ||
          interval === TimeInterval.FIVE_MINUTES ||
          interval === TimeInterval.FIFTEEN_MINUTES ||
          interval === TimeInterval.THIRTY_MINUTES ||
          interval === TimeInterval.ONE_HOUR
        ) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (interval === TimeInterval.FOUR_HOURS || interval === TimeInterval.ONE_DAY) {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
        }
      },
    },
    width: chartContainer.value.clientWidth,
    height: chartContainer.value.clientHeight,
  })

  candlestickSeries = chart.addCandlestickSeries({
    upColor: '#4ade80',
    downColor: '#ef4444',
    borderVisible: false,
    wickUpColor: '#4ade80',
    wickDownColor: '#ef4444',
  })
}

const getLocalISOString = (date) => {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 19)
}

const fetchMarketData = async () => {
  if (!props.cryptocurrency) return

  isLoading.value = true
  try {
    const intervalKey = Object.entries(TimeInterval).find(
      ([_, value]) => value === selectedInterval.value
    )?.[0]

    const [currentVWAP, historyResponse] = await Promise.all([
      vwapService.getCurrentVWAP({
        cryptoSymbol: props.cryptocurrency,
        fiatSymbol: 'USD',
        interval: intervalKey,
      }),
      vwapService.getVWAPHistory({
        cryptoSymbol: props.cryptocurrency,
        fiatSymbol: 'USD',
        startDate: getLocalISOString(dateTimeRange.value[0]),
        endDate: getLocalISOString(dateTimeRange.value[1]),
        interval: intervalKey,
        page: 0,
        size: 100,
      }),
    ])

    currentPrice.value = currentVWAP.vwap.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    const candleData = historyResponse.vwapHistory.content.map((item) => ({
      time: new Date(item.timestamp + 'Z').getTime() / 1000,
      open: item.openPrice,
      high: item.highPrice,
      low: item.lowPrice,
      close: item.closePrice,
    }))

    candlestickSeries.setData(candleData)
  } catch (error) {
    console.error('Error fetching market data:', error)
  } finally {
    isLoading.value = false
  }
}

let updateInterval
let resizeObserver

onMounted(() => {
  initChart()
  if (props.cryptocurrency) {
    fetchMarketData()
    initChart()
    updateInterval = setInterval(fetchMarketData, 1 * 15 * 1000)
  }

  resizeObserver = new ResizeObserver(() => {
    chart.applyOptions({
      width: chartContainer.value.clientWidth,
      height: chartContainer.value.clientHeight,
    })
  })
  resizeObserver.observe(chartContainer.value)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (chart) {
    chart.remove()
  }
})

watch([() => props.cryptocurrency, selectedInterval, dateTimeRange], () => {
  initChart()
  fetchMarketData()
})
</script>
