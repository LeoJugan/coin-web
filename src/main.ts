import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Icon } from '@iconify/vue';
// Vuetify
import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
import vuetify from './plugins/vuetify'
import { useAppApiDataStore } from '@/stores/app-api-data'


const app = createApp(App)
//子組件-確認畫面
import confirmComp from "@/components/common/confirmComp.vue";
app.component('confirmComp', confirmComp);
app.component('Icon', Icon)

app.use(createPinia())
app.use(router)
app.use(vuetify);



app.mount('#app')
