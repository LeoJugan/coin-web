<template>
  <div style="height: 100px;" v-if="modelValue">
    <v-dialog v-model="dialogVisible" scrollable  persistent :overlay="false" max-width="800px"
      transition="dialog-transition">
      <v-form ref="form" :model-value="formValid" @update:model-value="handleFormValidUpdate">
        <v-card>
          <v-container>
            <v-card-title>
              <v-row>
                <v-col cols="4">
                  <h4 class="mt-3 mb-3" v-if="currencyData.id">編輯幣別 (Vuetify)
                  </h4>
                  <h4 class="mt-3 mb-3" v-else>新增幣別 (Vuetify)
                  </h4>
                </v-col>
                <v-col cols="8" class="text-right">
                  <v-btn color="blue-grey-lighten-4" @click="handleClose">
                    <Icon icon="mingcute:close-fill" style="font-size: 16px;" />
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <!-- 原始 Vuetify 表單 -->
              <v-row class="tableInfo">
                <InputField
                  :model-value="currencyData.code"
                  @update:model-value="(value: string | number) => emitUpdateCurrencyData({ ...currencyData, code: String(value) })"
                  label="代碼"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  :rules="rulesUtil(['requiredRule', 'maxlength20'])"
                  :loading="isCheckingCode"
                  :error-message="codeValidationMessage"
                  :max-length="20"
                  required
                />

                <InputField
                  :model-value="currencyData.name"
                  @update:model-value="(value: string | number) => emitUpdateCurrencyData({ ...currencyData, name: String(value) })"
                  label="中文名稱"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  :rules="rulesUtil(['requiredRule', 'maxlength20'])"
                  :max-length="20"
                  required
                />

                <InputField
                  :model-value="currencyData.symbol"
                  @update:model-value="(value: string | number) => emitUpdateCurrencyData({ ...currencyData, symbol: String(value) })"
                  label="符號"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  :rules="rulesUtil(['requiredRule', 'maxlength20'])"
                  :max-length="20"
                  required
                />

                <v-col lg="6" cols="8"></v-col>

                <InputField
                  v-model="rateFloatValue"
                  label="匯率數值"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  :rules="rulesUtil(['requiredRuleDecimal', 'maxInt10W'])"
                  required
                />
                <v-col lg="6" cols="8" class="d-flex align-center">{{ formattedRateFloat }}</v-col>

                <InputField
                  :model-value="currencyData.description"
                  @update:model-value="(value: string | number) => emitUpdateCurrencyData({ ...currencyData, description: String(value) })"
                  label="幣別描述"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  :rules="rulesUtil(['requiredRule', 'maxlength100'])"
                  :max-length="100"
                  :lg="10"
                  :labelLg="2"
                  :cols="8"
                  required
                />
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="elevated"
                @click="handleSaveWithConfirm" :disabled="!formValid">
                儲存
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="handleClose">
                取消
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import type { CurrencyData } from '@/types/currency'
import { useAppApiDataStore } from '@/stores/app-api-data'
import { confirmItemAdd, confirmItemUpdate } from '@/config/confirmItems'
import InputField from '@/components/forms/InputField.vue'

// Props 定義
interface Props {
  modelValue: boolean
  currencyData: CurrencyData
  formValid: boolean
  rulesUtil: (array: string[]) => any[]
  checkCodeDuplicated?: (code: string) => Promise<string | boolean>
}

const props = defineProps<Props>()

// Store 實例
const appApiData = useAppApiDataStore()

// Emits 定義
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:currencyData': [value: CurrencyData]
  'update:formValid': [value: boolean]
  save: [data: CurrencyData]
  close: []
}>()

// 類型安全的 emit 函數
const emitUpdateCurrencyData = (value: CurrencyData) => {
  emit('update:currencyData', value)
}

// 計算屬性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const rateFloatValue = computed({
  get: () => props.currencyData.rateFloat ?? '',
  set: (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    emitUpdateCurrencyData({ ...props.currencyData, rateFloat: isNaN(numValue) ? null : numValue })
  }
})

const formattedRateFloat = computed(() => {
  const num = props.currencyData.rateFloat
  if (num === null || num === undefined) return ''
  if (isNaN(Number(num))) return ''
  const fixed = Number(num).toFixed(3)
  const formatted = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\.\d{3})\d*$/, '$1')
  return formatted
})

// 事件處理
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}


const handleSaveWithConfirm = () => {
  // 根據是否有 ID 來決定使用哪個確認項目
  const confirmItem = props.currencyData.id ? confirmItemUpdate : confirmItemAdd
  appApiData.updateConfirm(true, confirmItem, handleSaveConfirm)
}

const handleSaveConfirm = () => {
  emit('save', props.currencyData)
}

const handleFormValidUpdate = (value: boolean | null) => {
  emit('update:formValid', value ?? false)
}

// 代碼重複檢查狀態
const isCheckingCode = ref(false)
const codeValidationMessage = ref('')

// 監聽代碼變動
watch(
  () => props.currencyData.code,
  async (newCode, oldCode) => {
    // 如果代碼有變動且不為空，則進行重複檢查
    if (newCode && newCode !== oldCode && props.checkCodeDuplicated) {
      isCheckingCode.value = true
      codeValidationMessage.value = ''
      
      try {
        const result = await props.checkCodeDuplicated(newCode)
        if (typeof result === 'string') {
          codeValidationMessage.value = result
        } else if (result === false) {
          codeValidationMessage.value = '此代碼已存在'
        }
      } catch (error) {
        console.error('代碼重複檢查失敗:', error)
        codeValidationMessage.value = '檢查代碼時發生錯誤'
      } finally {
        isCheckingCode.value = false
      }
    } else if (!newCode) {
      // 如果代碼為空，清除驗證訊息
      codeValidationMessage.value = ''
    }
  },
  { immediate: false }
)
</script>
