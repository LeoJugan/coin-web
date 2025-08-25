<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import axios from "axios";
import { useAppApiDataStore } from '@/stores/app-api-data'
import moment from 'moment';
import { C } from 'vitest/dist/chunks/environment.d.cL3nLXbE';
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
  { title: "動作", key: "action", width: '20%', sortable: false, removable: true }

];

interface ConfirmItem {
  title: string;
  content: string;
  btnText: string;
  color: string;
  snackbarText: string;
  cancelBtnFlag: boolean;
}

const comfirmItemUpdate = ref<ConfirmItem>({
  title: "更新確認",
  content: "是否確認更新此筆資料？",
  btnText: "確認更新",
  color: "blue-darken-1",
  snackbarText: "資料已更新",
  cancelBtnFlag: true
});
const comfirmItemInit = ref<ConfirmItem>({
  title: "更新確認",
  content: "是否確認還原資料？",
  btnText: "確認更新",
  color: "blue-darken-1",
  snackbarText: "資料已更新",
  cancelBtnFlag: true
});
const comfirmItemRemove = ref<ConfirmItem>({
  title: "刪除確認",
  content: "是否確認刪除此筆資料？",
  btnText: "確認刪除",
  color: "red",
  snackbarText: "資料已刪除",
  cancelBtnFlag: true
});
interface CurrencyData {
  id: string
  code: string
  name: string
  symbol: string
  rate: string
  rateFloat: number | null
  description: string
};

const defaultCurrencyData = ref<CurrencyData>({
  id: '',
  code: '',
  name: '',
  symbol: '',
  rate: '',
  rateFloat: null,
  description: '',
});

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
  if (num === null || num === undefined || num === '' || isNaN(Number(num))) return '';
  const fixed = Number(num).toFixed(3);
  const formatted = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\.\d{3})\d*$/, '$1');
  return formatted;
}
const formattedRateFloat = computed(() => formatCurrency(currencyData.value.rateFloat));
const getCurrency = async () => {
  appApiData.getByPath('currencies').then((result) => {
    items.value = result;
  });
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
  // console.log(code);
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
    <v-btn color="blue-darken-1" variant="elevated"
      @click="currencyData = JSON.parse(JSON.stringify(defaultCurrencyData)); dialogUpdate = true;">
      新增幣別
    </v-btn>
    <v-btn variant="elevated" class="ml-2" @click="appApiData.updateConfirm(true, comfirmItemInit, handleInit)">
      還原資料
    </v-btn>
    <v-data-table-server :items="items" :headers="headers" :items-length="items.length" item-value="id"
      no-data-text="無資料" loading-text="資料傳輸中" hide-default-footer>
      <template v-slot:[`item.modifyDate`]="{ item }">
        {{ moment(item.modifyDate).format('YYYY/MM/DD HH:mm:ss') }}
      </template>

      <template v-slot:[`item.action`]="{ item }">


        <v-tooltip text="編輯">
          <template v-slot:activator="{ props }">
            <span class=" mr-3" v-bind="props"
              @click="currencyData = JSON.parse(JSON.stringify(item)); dialogUpdate = true;">
              <Icon icon="ic:baseline-edit" color="#0096c7" style="font-size: 24px;" />
            </span></template></v-tooltip>
        <v-tooltip text="刪除">
          <template v-slot:activator="{ props }">
            <span class=" mr-3" v-bind="props"
              @click="currencyData = JSON.parse(JSON.stringify(item)); appApiData.updateConfirm(true, comfirmItemRemove, handledelete)">
              <Icon icon="mdi:garbage" color="red" style="font-size: 24px;" />
            </span></template></v-tooltip>
      </template>
    </v-data-table-server>
  </main>
  <div style="height: 100px;" v-if="dialogUpdate">

    <v-dialog v-model="dialogUpdate" scrollable fullscreen persistent :overlay="false" max-width="500px"
      transition="dialog-transition">
      <v-form ref="form" v-model="formValid">


        <v-card>
          <v-container>
            <v-card-title>
              <v-row>
                <v-col cols="4">
                  <h4 class="mt-3 mb-3" v-if="currencyData.id">編輯幣別
                  </h4>
                  <h4 class="mt-3 mb-3" v-else>新增幣別
                  </h4>
                </v-col>

                <v-col cols="8" class="text-right "> <v-btn color="blue-grey-lighten-4" @click="dialogUpdate = false">
                    <Icon icon="mingcute:close-fill" style="font-size: 16px; " />
                  </v-btn></v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row class="tableInfo">
                <v-col cols="4" lg="2" class="text-right bg-thead thead"> <label class="form-label"
                    style="font-size: 16px;">
                    代碼
                  </label></v-col>
                <v-col lg="4" cols="8">
                  <v-text-field v-model="currencyData.code" variant="outlined" density="compact" hide-details="auto"
                    :rules="[...rulesUtil(['requiredRule', 'maxlength20']), checkCodeDuplicated]"></v-text-field>
                </v-col>
                <v-col cols="4" lg="2" class="text-right bg-thead thead"> <label class="form-label"
                    style="font-size: 16px;">
                    中文名稱
                  </label></v-col>
                <v-col lg="4" cols="8">
                  <v-text-field v-model="currencyData.name" variant="outlined" density="compact" hide-details="auto"
                    :rules="rulesUtil(['requiredRule', 'maxlength20'])"></v-text-field>
                </v-col>
                <v-col cols="4" lg="2" class="text-right bg-thead thead"> <label class="form-label"
                    style="font-size: 16px;">
                    符號
                  </label></v-col>
                <v-col lg="4" cols="8">
                  <v-text-field v-model="currencyData.symbol" variant="outlined" density="compact" hide-details="auto"
                    :rules="rulesUtil(['requiredRule', 'maxlength20'])"></v-text-field>
                </v-col>
                <v-col lg="6" cols="8"></v-col>
                <v-col cols="4" lg="2" class="text-right bg-thead thead"> <label class="form-label"
                    style="font-size: 16px;">
                    匯率數值
                  </label></v-col>
                <v-col lg="4" cols="8">
                  <v-text-field v-model="currencyData.rateFloat" variant="outlined" density="compact"
                    hide-details="auto" type="number"
                    :rules="rulesUtil(['requiredRuleDecimal', 'maxInt10W'])"></v-text-field>
                </v-col>
                <v-col lg="6" cols="8" class="d-flex align-center">{{ formattedRateFloat }}</v-col>
                <v-col cols="4" lg="2" class="text-right bg-thead thead"> <label class="form-label"
                    style="font-size: 16px;">
                    幣別描述
                  </label></v-col>
                <v-col lg="10" cols="8">
                  <v-text-field v-model="currencyData.description" variant="outlined" density="compact"
                    hide-details="auto" :rules="rulesUtil(['requiredRule', 'maxlength100'])"></v-text-field>
                </v-col>

              </v-row>
            </v-card-text><v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="elevated"
                @click="appApiData.updateConfirm(true, comfirmItemUpdate, handleUpdate)" :disabled="!formValid">
                儲存
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="dialogUpdate = false;">
                取消</v-btn>
            </v-card-actions></v-container></v-card> </v-form>
    </v-dialog>
  </div>
</template>
