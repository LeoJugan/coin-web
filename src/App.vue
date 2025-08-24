<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

import { useAppApiDataStore } from '@/stores/app-api-data';
const appApiData = useAppApiDataStore();

//lottie
import { Vue3Lottie } from 'vue3-lottie'
import animationData from '@/assets/loading.json'

</script>

<template>
  <header>


    <nav class="wrapper ml-1">
      <RouterLink to="/">幣別</RouterLink>
      <RouterLink to="/about">歷史資料</RouterLink>
    </nav>
  </header>
  <div class="main-content">
    <RouterView />
  </div>
  <div v-if="appApiData.confirmStatus"><v-dialog v-model="appApiData.confirmStatus">
      <confirmComp :confirmItem="appApiData.confirmItem" :confirmFoo="appApiData.confirmFoo">
      </confirmComp>
    </v-dialog></div>
  <div v-if="appApiData.autoSaveStatus"><v-dialog v-model="appApiData.autoSaveStatus" persistent>
      <Vue3Lottie :animationData="animationData" height="20%" width="20%" />
    </v-dialog></div>
  <div v-if="appApiData.snackbarItem">
    <v-snackbar class="snackbar" v-if="appApiData.snackbarItem" v-model="appApiData.snackbarStatus" elevation="24"
      location="right">
      <div class="d-flex align-center content">
        <div class="" style="white-space: pre-line">
          <h4> {{ appApiData.snackbarItem.snackbarText }}</h4>
          <p v-if="appApiData.snackbarItem.snackbarDetail">{{ appApiData.snackbarItem.snackbarDetail }}</p>
        </div>
      </div>
      <template v-slot:actions>
        <v-btn size="small" variant="text" @click="appApiData.updatesSnackbarStatus(false);"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.main-content {
  width: 1200px;
  margin: 0 auto;
  padding-top: 80px;

}

header {
  line-height: 1.5;
  max-height: 100vh;
  position: fixed;
  /* 新增 */
  top: 0;
  /* 新增 */
  left: 0;
  /* 新增 */
  width: 100%;
  /* 新增 */
  z-index: 1000;
  /* 新增，確保在最上層 */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: #555;
  /* 新增：未被選擇時的文字顏色 */
  background-color: transparent;
  /* 新增：未被選擇時的背景色 */
}

nav a.router-link-exact-active {
  color: #1976d2;
  /* 這裡設定選中時的文字顏色 */
  /* background-color: #e3f2fd; */
  /* 這裡設定選中時的背景色 */
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
