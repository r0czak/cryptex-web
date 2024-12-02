<template>
  <div class="dropdown w-full">
    <label
      tabindex="0"
      class="input input-bordered w-full flex justify-between items-center"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2">
        <img
          v-if="selectedOption"
          :src="getCryptoIcon(selectedOption.value)"
          :alt="`${selectedOption.label} icon`"
          class="w-5 h-5"
        />
        <span>{{ selectedOption ? selectedOption.label : 'Select cryptocurrency' }}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="ml-2"
        :class="{ 'rotate-180': isOpen }"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </label>
    <ul
      tabindex="0"
      class="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-full"
      :class="{ hidden: !isOpen }"
    >
      <li v-for="option in options" :key="option.value">
        <a @click="selectOption(option)" class="flex items-center gap-2">
          <img :src="getCryptoIcon(option.value)" :alt="`${option.label} icon`" class="w-5 h-5" />
          {{ option.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const isOpen = ref(false)

const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
)

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const getCryptoIcon = (cryptoName) => {
  try {
    return new URL(
      `../../assets/images/crypto/logos/${cryptoName.toLowerCase()}-${getSymbol(
        cryptoName
      )}-logo.svg`,
      import.meta.url
    ).href
  } catch (error) {
    return new URL(`../../assets/images/crypto/logos/bitcoin-btc-logo.svg`, import.meta.url).href
  }
}

const getSymbol = (cryptoName) => {
  const symbolMap = {
    bitcoin: 'btc',
    ethereum: 'eth',
    litecoin: 'ltc',
  }
  return symbolMap[cryptoName.toLowerCase()] || 'btc'
}
</script>

<style scoped>
.dropdown-content {
  z-index: 50;
}

svg {
  transition: transform 0.2s ease;
}
</style>
