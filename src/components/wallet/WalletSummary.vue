<template>
  <div class="card bg-base-200 mb-8">
    <div class="card-body">
      <div class="mb-8">
        <h2 class="card-title text-2x">Total Balance</h2>
        <p class="font-mono text-4xl text-success mt-2">${{ formatBalance(totalBalance) }}</p>
      </div>

      <div class="bg-base-300 rounded-box p-4">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4"
        >
          <select
            v-model="selectedInterval"
            class="select select-bordered select-sm w-full sm:w-auto"
          >
            <option
              v-for="interval in Object.values(TimeInterval)"
              :value="interval"
              :key="interval"
            >
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

        <div class="h-[300px] relative">
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-base-300/50"
          >
            <span class="loading loading-spinner loading-lg"></span>
          </div>
          <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { vwapService } from '../../services/crypto/vwapHistory.service'
import { TimeInterval } from '../../types/TimeInterval'
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths } from 'date-fns'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  cryptoBalances: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const isLoading = ref(false)
const selectedInterval = ref(TimeInterval.FIFTEEN_MINUTES)
const dateTimeRange = ref([new Date(new Date().setDate(new Date().getDate() - 1)), new Date()])
const chartData = ref(null)
const totalBalance = ref(0)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        callback: (value) => `$${value.toLocaleString()}`,
      },
    },
    x: {
      display: false,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          return `$${context.parsed.y.toLocaleString()}`
        },
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}

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

const getLocalISOString = (date) => {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 19) // Remove milliseconds and Z
}

const fetchChartData = async () => {
  isLoading.value = true
  try {
    console.log('Crypto balances:', props.cryptoBalances)
    if (!props.cryptoBalances || props.cryptoBalances.length === 0) {
      console.log('No crypto balances available')
      return
    }

    // Get VWAP history for each cryptocurrency in the wallet
    const vwapPromises = props.cryptoBalances.map(async (balance) => {
      const intervalKey = Object.entries(TimeInterval).find(
        ([_, value]) => value === selectedInterval.value
      )?.[0]

      console.log(
        'Making API call for:',
        balance.cryptocurrencySymbol,
        'with interval:',
        intervalKey
      )

      const response = await vwapService.getVWAPHistory({
        cryptoSymbol: balance.cryptocurrencySymbol,
        fiatSymbol: 'USD',
        startDate: getLocalISOString(dateTimeRange.value[0]),
        endDate: getLocalISOString(dateTimeRange.value[1]),
        interval: intervalKey,
        page: 0,
        size: 100,
      })
      return {
        symbol: balance.cryptocurrencySymbol,
        amount: balance.balance,
        history: response.vwapHistory.content,
      }
    })

    const vwapResults = await Promise.all(vwapPromises)

    // Combine all timestamps from all cryptocurrencies
    const allTimestamps = [
      ...new Set(vwapResults.flatMap((result) => result.history.map((item) => item.timestamp))),
    ].sort()

    // Calculate total wallet value for each timestamp
    const totalValues = allTimestamps.map((timestamp) => {
      const totalValue = vwapResults.reduce((sum, crypto) => {
        const priceData = crypto.history.find((item) => item.timestamp === timestamp)
        if (priceData) {
          return sum + priceData.vwap * crypto.amount
        }
        return sum
      }, 0)
      return { timestamp, value: totalValue }
    })

    chartData.value = {
      labels: totalValues.map((item) => new Date(item.timestamp).toLocaleString()),
      datasets: [
        {
          borderColor: '#4ade80',
          tension: 0.1,
          data: totalValues.map((item) => item.value),
        },
      ],
    }
  } catch (error) {
    console.error('Error fetching chart data:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  [selectedInterval, dateTimeRange, () => props.cryptoBalances],
  () => {
    console.log('Watch triggered:', {
      interval: selectedInterval.value,
      dateRange: dateTimeRange.value,
      balances: props.cryptoBalances,
    })
    if (dateTimeRange.value?.[0] && dateTimeRange.value?.[1] && props.cryptoBalances?.length > 0) {
      fetchChartData()
    }
  },
  { immediate: true }
)

const formatBalance = (value) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const calculateTotalBalance = async () => {
  try {
    const vwapPromises = props.cryptoBalances.map(async (balance) => {
      const response = await vwapService.getCurrentVWAP({
        cryptoSymbol: balance.cryptocurrencySymbol,
        fiatSymbol: 'USD',
        interval: 'FIFTEEN_MINUTES',
      })
      return balance.balance * response.vwap
    })

    const balanceValues = await Promise.all(vwapPromises)
    totalBalance.value = balanceValues.reduce((sum, value) => sum + value, 0)
  } catch (error) {
    console.error('Error calculating total balance:', error)
  }
}

let balanceUpdateInterval

onMounted(() => {
  calculateTotalBalance()
  fetchChartData()
  balanceUpdateInterval = setInterval(calculateTotalBalance, 1 * 60 * 1000)
})

onUnmounted(() => {
  if (balanceUpdateInterval) {
    clearInterval(balanceUpdateInterval)
  }
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
