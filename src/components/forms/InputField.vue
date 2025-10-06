<template>
  <template v-if="label">
    <!-- 標籤列 -->
    <v-col 
      :lg="labelLg"
      :cols="labelCols"
      :md="labelMd"
      :sm="labelSm"
      :xl="labelXl"
      class="text-right bg-thead thead"
    >
      <label class="form-label" style="font-size: 16px;">
        <span v-if="required" style="margin-right: 0.25rem; color: #f87171;">*</span>{{ label }}
      </label>
    </v-col>
  </template>
  
  <!-- 輸入框列 -->
  <v-col 
    :lg="lg"
    :cols="cols"
    :md="md"
    :sm="sm"
    :xl="xl"
  >
    <v-text-field
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength"
      :min="min"
      :max="max"
      :step="step"
      :rules="rules"
      :error-messages="errorMessage ? [errorMessage] : []"
      :hint="helpText"
      :persistent-hint="!!helpText"
      :counter="showCounter && maxLength"
      :clearable="showClear"
      :prepend-icon="prefixIcon"
      :append-icon="suffixIcon"
      :variant="variant"
      :density="density"
      :hide-details="hideDetails"
      :required="required"
      :loading="loading"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @click:clear="handleClear"
    />
  </v-col>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Props 定義
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  errorMessage?: string
  helpText?: string
  prefixIcon?: any
  suffixIcon?: any
  showClear?: boolean
  showCounter?: boolean
  maxLength?: number
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'underlined' | 'plain'
  density?: 'default' | 'comfortable' | 'compact'
  hideDetails?: boolean | 'auto'
  loading?: boolean
  rules?: any[]
  // 輸入框佈局控制屬性
  lg?: number | string
  cols?: number | string
  md?: number | string
  sm?: number | string
  xl?: number | string
  // 標籤佈局控制屬性
  labelLg?: number | string
  labelCols?: number | string
  labelMd?: number | string
  labelSm?: number | string
  labelXl?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'outlined',
  density: 'default',
  hideDetails: 'auto',
  showClear: false,
  showCounter: false,
  lg: 4,
  cols: 8,
})

// 計算標籤佈局屬性
const labelLg = computed(() => props.labelLg ?? Math.floor(Number(props.lg) / 2))
const labelCols = computed(() => props.labelCols ?? Math.floor(Number(props.cols) / 2))
const labelMd = computed(() => props.labelMd ?? Math.floor(Number(props.md || props.lg) / 2))
const labelSm = computed(() => props.labelSm ?? Math.floor(Number(props.sm || props.cols) / 2))
const labelXl = computed(() => props.labelXl ?? Math.floor(Number(props.xl || props.lg) / 2))

// Emits 定義
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  clear: []
}>()

// 計算屬性
const hasError = computed(() => !!props.errorMessage)

// 事件處理
const handleInput = (value: string | number) => {
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
