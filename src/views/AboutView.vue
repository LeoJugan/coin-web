<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import axios from "axios";
import { useAppApiDataStore } from '@/stores/app-api-data'
import moment from 'moment';
const appApiData = useAppApiDataStore()


// import TheWelcome from '../components/TheWelcome.vue'
const title = ref('Welcome to the Home Page');
const formValid = ref(false);
const items = ref([])
const headers = [
  { title: '代碼', key: 'code' },
  { title: '中文', key: 'name' },
  { title: '描述', key: 'description' },
  { title: '符號', key: 'symbol' },
  { title: '匯率', key: 'rate' },
  { title: '匯率數值', key: 'rateFloat' },
  { title: '修改日期', key: 'modifyDate' },
  { title: "類型", key: "action" }

];



function formatCurrency(num: number): string {
  if (num === null || num === undefined || num === '' || isNaN(Number(num))) return '';
  const fixed = Number(num).toFixed(3);
  const formatted = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\.\d{3})\d*$/, '$1');
  currencyData.value.rate = formatted; // 同步更新 rate 欄位
  return formatted;
}
const formattedRateFloat = computed(() => formatCurrency(currencyData.value.rateFloat));
const getCurrency = async () => {
  appApiData.getByPath('currenciesHist').then((result) => {
    items.value = result;
  });
};









onMounted(() => {

});
getCurrency()
// updateCurrency(1, currencyData);
</script>

<template>
  <main>

    <v-data-table-server :items="items" :headers="headers" :items-length="items.length" item-value="id"
      no-data-text="無資料" loading-text="資料傳輸中" hide-default-footer>
      <template v-slot:[`item.modifyDate`]="{ item }">
        {{ moment(item.modifyDate).format('YYYY/MM/DD HH:mm:ss') }}
      </template>


    </v-data-table-server>
  </main>

</template>
