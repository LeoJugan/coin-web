import { defineStore } from "pinia";
import axios from 'axios'

export const useAppApiDataStore = defineStore({
    id: "appApiData",
    state: () => ({
        apiServerUrl: process.env.NODE_ENV === 'production'
            ? '/devTest/'
            : '/devTest/',
        //confirm
        confirmStatus: false,
        confirmItem: null,
        confirmFoo: null,

        //控制loading原件 loading關閉後 如果有設定snackbar 會自動開啟
        autoSaveStatus: false,
        //控制全域snackbar
        snackbarItem: null,
        snackbarStatus: false,
    }),
    getters: {},
    actions: {
        async fetchCurrencyData() {
            try {
                const response = await axios.get(this.apiServerUrl + 'v1/bpi/currentprice.json');
                return response.data;
            } catch (error) {
                console.error("Error fetching currency data:", error);
                throw error;
            }
        },
        updateConfirm(status, confirmItem = null, confirmFoo = null) {
            this.confirmStatus = status;
            if (status) {
                this.confirmItem = confirmItem; this.confirmFoo = confirmFoo;
            }
        },
        updateAutoSaveStatus(val, timeout = 0) {
            // console.log("updateAutoSaveStatus ", val, timeout);
            setTimeout(() => {
                this.autoSaveStatus = val;
            }, timeout);

            if (!val && this.snackbarItem) {
                this.updatesSnackbarStatus(true);
                setTimeout(() => {
                    this.updatesSnackbarStatus(false);
                }, this.snackbarItem && this.snackbarItem.timeout ? this.snackbarItem.timeout + 200 : 200);
            }

        },
        updatesSnackbarStatus(val) {
            this.snackbarStatus = val;
            if (!val)
                this.snackbarItem = null;
            else
                setTimeout(() => {
                    this.updatesSnackbarStatus(false);
                }, this.snackbarItem && this.snackbarItem.timeout ? this.snackbarItem.timeout + 200 : 200);
            //清除物件
        },
        //準備Snackbar 但是不會觸發
        prepareSnackbar(snackbarItem) {
            if (!snackbarItem.timeout)
                snackbarItem.timeout = 5000
            // console.log("snackbarItem ", snackbarItem);
            this.snackbarItem = snackbarItem;
        },

        //get query 路徑、欄位名稱、查詢值，開啟loading、延遲關閉loading
        getByQuery(path, key, value, autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            const fullpath = key ? this.apiServerUrl + 'api/' + path + '?' + key + '=' + value : this.apiServerUrl + 'api/' + path;
            return axios
                .get(
                    fullpath,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, key, value, " getByQuery!! ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //get query 路徑key、複數{欄位名稱key,查詢值value}、、開啟loading、延遲關閉loading
        getByQueryMulti(path, jsonArray = [], autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            // console.log(jsonArray, "jsonArray ", jsonArray.every(item => item.hasOwnProperty('key')));
            // jsonArray.forEach(item => { console.log(item); })

            if (jsonArray.length == 0 && !jsonArray.every(item => item.hasOwnProperty('key') && item.hasOwnProperty('value'))) {
                globalFunctions.handErrorUtil("getByQueryMulti jsonArray", jsonArray);
                return;
            }
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            const queryString = jsonArray.map(item => `${item.key}=${item.value}`).join('&');
            const fullpath = this.apiServerUrl + 'api/' + path + '?' + queryString;
            return axios
                .get(
                    fullpath,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, jsonArray, " getByQueryMulti ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //get path 路徑、欄位名稱、查詢值，開啟loading、延遲關閉loading
        getByPath(path, valueArray = [], autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            // if (valueArray.length == 0) {
            //     globalFunctions.handErrorUtil("getByPath valueArray", valueArray);
            //     return;
            // }
            const queryString = valueArray.join('/');
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            const fullpath = this.apiServerUrl + 'api/' + path + '/' + queryString;
            return axios
                .get(
                    fullpath,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, valueArray, " getByPath ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //post body 路徑、object，開啟loading跟延遲關閉
        postByBody(path, object, autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200, responseType) {
            let vm = this;
            // console.log("responseType ", responseType);
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            return axios
                .post(
                    this.apiServerUrl + 'api/' + path, object,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken,
                        },
                        responseType: responseType ? responseType : 'json',
                    })
                .then(function (response) {

                    if (process.env.NODE_ENV != 'production')
                        console.log(path, object, " postByBody ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {


                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //post query 路徑key、複數{欄位名稱key,查詢值value}、、開啟loading、延遲關閉loading
        //post 同時支援query跟body兩種方式
        //[ {key:'a1',value:'a2'},{key:'b1',value:'b2'},{body:{...}} ]
        postByQueryMulti(path, jsonArray = [], autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            if (jsonArray.length == 0 && !jsonArray.every(item => item.hasOwnProperty('key') && item.hasOwnProperty('value'))) {
                globalFunctions.handErrorUtil("postByQueryMulti jsonArray", jsonArray);
                return;
            }

            const queryString = jsonArray.filter(item => item.hasOwnProperty('key')).map(item => `${item.key}=${item.value}`).join('&');
            const body = jsonArray.find(item => item.hasOwnProperty('body')) ? jsonArray.find(item => item.hasOwnProperty('body')).body : {}
            const fullpath = this.apiServerUrl + 'api/' + path + '?' + queryString;
            return axios
                .post(
                    fullpath, body,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(fullpath, " postByQueryMulti ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //put body 路徑、object，開啟loading跟延遲關閉
        putByBody(path, object, autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            return axios
                .put(
                    this.apiServerUrl + 'api/' + path, object,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, object, " putByBody ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //put query 路徑key、複數{欄位名稱key,查詢值value}、、開啟loading、延遲關閉loading
        //put 同時支援query跟body兩種方式
        //[ {key:'a1',value:'a2'},{key:'b1',value:'b2'},{body:{...}} ]
        putByQueryMulti(path, jsonArray = [], autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            if (jsonArray.length == 0 && !jsonArray.every(item => item.hasOwnProperty('key') && item.hasOwnProperty('value'))) {
                globalFunctions.handErrorUtil("putByQueryMulti jsonArray", jsonArray);
                return;
            }

            const queryString = jsonArray.filter(item => item.hasOwnProperty('key')).map(item => `${item.key}=${item.value}`).join('&');
            const body = jsonArray.find(item => item.hasOwnProperty('body')) ? jsonArray.find(item => item.hasOwnProperty('body')).body : {}
            const fullpath = this.apiServerUrl + 'api/' + path + '?' + queryString;
            return axios
                .put(
                    fullpath, body,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(fullpath, " putByQueryMulti ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },
        //put body 路徑、object，開啟loading跟延遲關閉
        //query同時支援query跟body兩種方式 字串 => path/uuid JSON path?key=value
        //[ {key:'a1',value:'a2'},{key:'b1',value:'b2'}]
        deleteByQuery(path, query, autoSaveStatusStart = true, autoSaveStatusEnd = true, timeout = 200) {
            let vm = this;
            // const fullpath = typeof query === 'string' ? this.apiServerUrl + 'api/' + path + '/' + query : this.apiServerUrl + 'api/' + path + '?' + query.key + '=' + query.value;
            let fullpath = ''
            if (typeof query === 'string')
                fullpath = vm.apiServerUrl + 'api/' + path + '/' + query;
            else if (Array.isArray(query)) {
                const queryString = query.filter(item => item.hasOwnProperty('key')).map(item => `${item.key}=${item.value}`).join('&');
                fullpath = vm.apiServerUrl + 'api/' + path + '?' + queryString;
            } else if (typeof query === 'object') {
                fullpath = vm.apiServerUrl + 'api/' + path + '?' + query.key + '=' + query.value;
            }

            if (autoSaveStatusStart) vm.updateAutoSaveStatus(true);
            return axios
                .delete(
                    fullpath,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then(function (response) {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, query, " deleteByBody ", response.data);
                    // vm.infoUserArray = response.data;
                    return response.data
                })
                .catch(function (error) {

                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) vm.updateAutoSaveStatus(false);
                    }, timeout);

                })
        },

    }

});