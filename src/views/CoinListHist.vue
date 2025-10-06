<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAppApiDataStore } from '@/stores/app-api-data'
import moment from 'moment';
import type { CurrencyHistData } from '@/types/currency';
const appApiData = useAppApiDataStore()



// const title = ref('Welcome to CoinList'); // 未使用，已註解
const items = ref<CurrencyHistData[]>([])
const headers = [
  { title: '代碼', key: 'code' },
  { title: '中文', key: 'name' },
  { title: '描述', key: 'description' },
  { title: '符號', key: 'symbol' },
  { title: '匯率', key: 'rate' },
  { title: '匯率數值', key: 'rateFloat' },
  { title: '修改日期', key: 'modifyDate' },
  { title: "類型", key: "type" },

];

const getCurrency = async () => {
  try {
    const result = await appApiData.getByPath('currenciesHist');
    items.value = result;
  } catch (error) {
    console.error('Failed to fetch currency history:', error);
    items.value = [];
  }
};









onMounted(() => {

});
getCurrency()
// updateCurrency(1, currencyData);
</script>

<template>
  <main>
    <h1>歷史記錄</h1>
    <v-data-table-server :items="items" :headers="headers" :items-length="items?.length || 0" item-value="id"
      no-data-text="無資料" loading-text="資料傳輸中" hide-default-footer>
      <template v-slot:[`item.modifyDate`]="{ item }">
        {{ moment(item.modifyDate).format('YYYY/MM/DD HH:mm:ss') }}
      </template>


    </v-data-table-server>
  </main>

</template>
