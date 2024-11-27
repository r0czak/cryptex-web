<template>
  <div class="custom-input">
    <input :id="id" :value="modelValue" :type="type" :placeholder="placeholder" :required="required"
      @input="handleInput" class="input-field" />
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  let value = event.target.value
  if (props.type === 'number') {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      emit('update:modelValue', value)
    }
  } else {
    emit('update:modelValue', value)
  }
}
</script>

<style scoped>
.custom-input {
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #3d3e82;
  border-radius: 4px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #4a4aa3;
}

.input-field::placeholder {
  color: #666;
}
</style>
