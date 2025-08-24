<template>
  <v-dialog v-model="dialogConfirm" persistent :max-width="dialogItem.width">
    <v-card>
      <v-card-title>
        <h3 color="primaryDark" text>{{ dialogItem.title }}</h3>
      </v-card-title>
      <v-card-text>
        <p>{{ dialogItem.content }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="elevated" @click="confirmFoo(); handleConfirm();">
          {{ dialogItem.btnText }}
        </v-btn>
        <v-btn text @click.stop="handleClose"
          v-show="dialogItem.cancelBtnFlag == null || dialogItem.cancelBtnFlag">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getCurrentInstance } from 'vue'

const props = defineProps<{
  confirmItem: any,
  confirmFoo: Function
}>()

const dialogConfirm = ref(true)
const dialogItem = ref({ ...props.confirmItem })

// 預設值設定
onMounted(() => {
  if (!dialogItem.value.width) dialogItem.value.width = '600px'
  if (!dialogItem.value.title) dialogItem.value.title = '請確認變更'
  if (!dialogItem.value.content) dialogItem.value.content = '確認變更後，將進行資料更新'
  if (!dialogItem.value.btnText) dialogItem.value.btnText = '確認變更'
  if (!dialogItem.value.snackbarText) dialogItem.value.snackbarText = '資料已更新'
})

// 取得全域 appApiData
const { appContext } = getCurrentInstance()
import { useAppApiDataStore } from '@/stores/app-api-data'

const appApiData = useAppApiDataStore()

function handleClose() {
  dialogConfirm.value = false
  appApiData.updateConfirm(false)
}

function handleConfirm() {
  dialogConfirm.value = false
  appApiData.updateConfirm(false)
  const snackbar = {
    snackbarText: dialogItem.value.snackbarText,
    color: !dialogItem.value.color ? 'primary' : dialogItem.value.color,
    timeout: !dialogItem.value.snackbarTimeout ? '2000' : dialogItem.value.snackbarTimeout,
  }
  if (props.confirmItem.noSnackbar)
    appApiData.prepareSnackbar(null)
  else
    appApiData.prepareSnackbar(snackbar)
}
</script>
