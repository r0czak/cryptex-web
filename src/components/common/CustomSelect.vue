<template>
  <div class="custom-select" :class="{ open: isOpen }">
    <div class="selected" @click="toggleDropdown">
      <div v-if="selectedOption" class="option-content">
        <img
          :src="getCryptoIcon(selectedOption.value)"
          :alt="selectedOption.label"
          class="crypto-icon"
        />
        <a>{{ selectedOption.label }}</a>
      </div>
      <div v-else class="placeholder">Select cryptocurrency</div>
    </div>
    <div v-if="isOpen" class="options">
      <div
        v-for="option in options"
        :key="option.value"
        class="option"
        @click="selectOption(option)"
      >
        <img :src="getCryptoIcon(option.value)" :alt="option.label" class="crypto-icon" />
        <a>{{ option.label }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array,
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const getSymbol = (cryptoName) => {
  const symbolMap = {
    bitcoin: 'btc',
    ethereum: 'eth',
    litecoin: 'ltc',
  }
  return symbolMap[cryptoName.toLowerCase()] || 'btc'
}

const getCryptoIcon = (cryptoName) => {
  const iconName = cryptoName.toLowerCase()
  try {
    return new URL(
      `../../assets/images/crypto/logos/${iconName}-${getSymbol(cryptoName)}-logo.svg`,
      import.meta.url
    ).href
  } catch (error) {
    return new URL(`../../assets/images/crypto/logos/bitcoin-btc-logo.svg`, import.meta.url).href
  }
}
</script>

<style scoped>
.custom-select {
  width: 100%;
  position: relative;
}

.selected {
  padding: 0.75rem;
  border: 1px solid #3d3e82;
  border-radius: 4px;
  background: #1a1a1a;
  color: white;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
  cursor: pointer;
  max-height: 16px;
}

.selected:hover {
  border-color: #4a4aa3;
}

.options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid #3d3e82;
  border-radius: 4px;
  z-index: 1000;
}

.option {
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.option:hover {
  background: #2d2e72;
}

.crypto-icon {
  width: 24px;
  height: 24px;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.placeholder {
  color: #666;
  font-family: var(--font-mono);
}
</style>
