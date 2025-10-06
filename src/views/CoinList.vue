<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import axios from "axios";
import { useAppApiDataStore } from '@/stores/app-api-data'
import moment from 'moment';
import type { CurrencyData } from '@/types/currency';
import { confirmItemUpdate, confirmItemInit, confirmItemRemove } from '@/config/confirmItems';
import { CoinInputVDialog } from '@/components/dialogs';
const appApiData = useAppApiDataStore()



const title = ref('Welcome to CoinList');
const formValid = ref(false);
const items = ref<CurrencyData[]>([])
const headers = [
  { title: '代碼', key: 'code' },
  { title: '中文', key: 'name' },
  { title: '描述', key: 'description' },
  { title: '符號', key: 'symbol' },
  { title: '匯率', key: 'rate' },
  { title: '匯率數值', key: 'rateFloat' },
  { title: '修改日期', key: 'modifyDate' },
  { title: "動作", key: "action", width: '20%', sortable: false, removable: true }

];



//空白乾淨的
const defaultCurrencyData = ref<CurrencyData>({
  id: '',
  code: '',
  name: '',
  symbol: '',
  rate: '',
  rateFloat: null,
  description: '',
});

//target物件
const currencyData = ref<CurrencyData>({
  id: '',
  code: '',
  name: '',
  symbol: '',
  rate: '',
  rateFloat: null,
  description: '',
});

const dialogUpdate = ref(false);

// const updateCurrency = async (id, data) => {
//   try {
//     const response = await axios.put(`/devTest/api/currencies/${id}`, data, {
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     console.log("更新成功:", response.data);
//   } catch (error) {
//     console.error("更新失敗:", error.response ? error.response.data : error.message);
//   }
// };

function formatCurrency(num: number | null): string {
  if (num === null || num === undefined) return '';
  if (isNaN(Number(num))) return '';
  const fixed = Number(num).toFixed(3);
  const formatted = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\.\d{3})\d*$/, '$1');
  return formatted;
}
const formattedRateFloat = computed(() => formatCurrency(currencyData.value.rateFloat));

// 為 InputField 創建計算屬性
const rateFloatInput = computed({
  get: () => currencyData.value.rateFloat || '',
  set: (value: string | number) => {
    currencyData.value.rateFloat = value ? Number(value) : null;
  }
});


const getCurrency = async () => {
  try {
    const result = await appApiData.getByPath('currencies');
    items.value = result;
  } catch (error) {
    console.error('Failed to fetch currencies:', error);
    items.value = [];
  }
};

const handleInit = async () => {
  appApiData.getByPath('currenciesInit', [], true, false).then((result) => {
    getCurrency();
  });
};


const handleUpdate = () => {
  currencyData.value.rate = formatCurrency(currencyData.value.rateFloat);
  if (!currencyData.value.id) {
    // 新增
    appApiData.postByBody('currencies', currencyData.value).then((result) => {
      getCurrency();
      dialogUpdate.value = false;
    });
  } else {
    // 修改
    appApiData.putByBody('currencies', currencyData.value).then((result) => {
      getCurrency();
      dialogUpdate.value = false;
    });
  }
}

const handleDialogClose = () => {
  // 可以添加關閉時的清理邏輯
}


const handledelete = (item: any) => {
  // console.log(currencyData.value);
  // axios.delete(`/devTest/api/currencies/${currencyData.value.id}`, {
  //   headers: { "Content-Type": "application/json" }
  // })
  //   .then(response => {
  //     console.log('刪除成功', response.status);
  //   })
  //   .catch(error => {
  //     console.error('刪除失敗', error);
  //   });
  appApiData.deleteByQuery('currencies', currencyData.value.id).then((result) => {
    getCurrency();
  });
  // appApiData.updateAutoSaveStatus(false);

  // deleteByQuery(path, query, autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {

  console.log("刪除成功");
};

const checkCodeDuplicated = async (code: string) => {
//   console.log(code);
  if (!code) return true
  const result = await appApiData.getByPath('currenciesFindByCode', [code], false, false);
  // 如果 result 有資料且 id 不同，代表重複
  if (result && (!currencyData.value.id || currencyData.value.id !== result.id)) {
    return '代碼重複';
  }
  return true;
};


const rulesUtil = (array: string[]): any[] => {
  const rules: { [key: string]: any[] } = {
    requiredRule: [
      (v: any) => !!v || '此欄位必填',
    ],
    //容許0 目前數字欄位通則 
    requiredRuleInt: [
      (v: any) => v != null && v.toString().length <= 100 || '最大長度是100',
      (v: any) => v !== null || "此欄位必填",
      (v: any) => !isNaN(v) || "此欄位必須是數字",
      // (v: any) => v >= 0 || "此欄位必須大於0",
      (v: any) => v === undefined || v === null || v === '' || (/^(0|[1-9][0-9]*)$/.test(v)) || '請填寫正整數或 0'
    ],
    requiredRuleDecimal: [
      (v: any) => v !== null && v !== undefined && v !== '' || "此欄位必填",
      (v: any) => v != null && v.toString().length <= 100 || '最大長度是100',
      (v: any) => !isNaN(v) || "此欄位必須是數字",
      (v: any) => {
        const val = parseFloat(v);
        return v === '' || (!isNaN(val) && val >= 0) || '請填寫 0 或正數';
      }
    ],
    //positiveInteger positiveIntegerOrZero 目前沒用
    positiveInteger: [(v: any) => v === undefined || v === null || v === '' || /^[0-9]*[1-9][0-9]*$/.test(v) || '請填寫正整數'],
    positiveIntegerOrZero: [(v: any) => v === undefined || v === null || v === '' || (/^(0|[1-9][0-9]*)$/.test(v)) || '請填寫正整數或 0'],
    requiredRuleIntSelect: [(v: any) => /^(0|[1-9][0-9]*)$/.test(v) || '此欄位必填'],
    onlyEnAndNumRule: [
      (v: any) => !v || /^[A-Za-z0-9]+$/.test(v) || '只能輸入英文字母與數字',
    ],
    emailRules: [(v: any) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v
      ) || "e-Mail格式有誤!",],
    maxInt10W: [(v: any) => v == null || (v != null && v <= 100000) || '最大值是100000'],
    maxInt2B: [(v: any) => v == null || (v != null && v <= 2000000000) || '最大值是2000000000'],

  }
  const result: any[] = [];
  //如果是maxlength20 就是限制不能超過20字
  // array.forEach(rule => {
  //   if (rules[rule]) {
  //     result.push(...rules[rule]);
  //   } else if (rule.indexOf('maxlength') != -1) {
  //     let maxlength = rule.replace('maxlength', '');
  //     result.push((v: any) => v == null || (v != null && v.length <= parseInt(maxlength)) || '最大長度是' + maxlength);
  //   }
  // });
  array.forEach(rule => {
    if (Array.isArray(rules[rule])) {
      result.push(...rules[rule]);
    } else if (rule.indexOf('maxlength') !== -1) {
      let maxlength = rule.replace('maxlength', '');
      result.push((v: any) => v == null || (v != null && v.length <= parseInt(maxlength)) || '最大長度是' + maxlength);
    }
  });

  return result;
}

onMounted(() => {

});
getCurrency()
// updateCurrency(1, currencyData);
</script>

<template>
  <main>
    <v-btn color="green-darken-1" variant="elevated" class="ml-2"
      @click="currencyData = JSON.parse(JSON.stringify(defaultCurrencyData)); dialogUpdate = true;">
      新增幣別
    </v-btn>
    <v-btn variant="elevated" class="ml-2" @click="appApiData.updateConfirm(true, confirmItemInit, handleInit)">
      還原資料
    </v-btn>
    <v-data-table-server :items="items" :headers="headers" :items-length="items?.length || 0" item-value="id"
      no-data-text="無資料" loading-text="資料傳輸中" hide-default-footer>
      <template v-slot:[`item.modifyDate`]="{ item }">
        {{ moment(item.modifyDate).format('YYYY/MM/DD HH:mm:ss') }}
      </template>

      <template v-slot:[`item.action`]="{ item }">


        <v-tooltip text="編輯">
          <template v-slot:activator="{ props }">
            <span class=" mr-3" v-bind="props"
              @click="currencyData = JSON.parse(JSON.stringify(item)); dialogUpdate = true;">
              <Icon icon="ic:baseline-edit" color="#4caf50" style="font-size: 24px;" />
            </span></template></v-tooltip>
        <v-tooltip text="刪除">
          <template v-slot:activator="{ props }">
            <span class=" mr-3" v-bind="props"
              @click="currencyData = JSON.parse(JSON.stringify(item)); appApiData.updateConfirm(true, confirmItemRemove, handledelete)">
              <Icon icon="mdi:garbage" color="red" style="font-size: 24px;" />
            </span></template></v-tooltip>
      </template>
    </v-data-table-server>
  </main>

  <!-- Vuetify 版本 Dialog -->
  <CoinInputVDialog
    v-model="dialogUpdate"
    v-model:currency-data="currencyData"
    v-model:form-valid="formValid"
    :rules-util="rulesUtil"
    :check-code-duplicated="checkCodeDuplicated"
    @save="handleUpdate"
    @close="handleDialogClose"
  />
</template>
