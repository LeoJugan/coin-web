import { defineStore } from "pinia";
import axios from 'axios'

// 型別定義
interface SnackbarItem {
    timeout?: number;
    [key: string]: any;
}

interface QueryItem {
    key: string;
    value: string;
}

interface BodyItem {
    body: any;
}

type QueryArrayItem = QueryItem | BodyItem;

// 全域函數定義（如果不存在）
declare global {
    const globalFunctions: {
        handErrorUtil: (message: string, data: any) => void;
    };
}

// 如果 globalFunctions 不存在，創建一個預設實作
if (typeof globalFunctions === 'undefined') {
    (window as any).globalFunctions = {
        handErrorUtil: (message: string, data: any) => {
            console.error(message, data);
        }
    };
}



export const useAppApiDataStore = defineStore({
    id: "appApiData",
    state: () => ({
        apiServerUrl: process.env.NODE_ENV === 'production'
            ? '/production/'
            // : '/devTest/',
            : '/production/',
        apiToken: null as string | null,
        //confirm
        confirmStatus: false,
        confirmItem: null as any,
        confirmFoo: null as any,

        //控制loading原件 loading關閉後 如果有設定snackbar 會自動開啟
        autoSaveStatus: false,
        //控制全域snackbar
        snackbarItem: null as SnackbarItem | null,
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
        updateConfirm(status: boolean, confirmItem: any = null, confirmFoo: any = null) {
            this.confirmStatus = status;
            if (status) {
                this.confirmItem = confirmItem; this.confirmFoo = confirmFoo;
            } else {
                this.confirmItem = null; this.confirmFoo = null;
            }
        },
        updateAutoSaveStatus(val: boolean, timeout: number = 0) {
            // console.log("updateAutoSaveStatus ", val, timeout);
            setTimeout(() => {
                this.autoSaveStatus = val;
            }, timeout);
            // console.log("updateAutoSaveStatus ", val, this.snackbarItem);
            if (!val && this.snackbarItem) {
                this.updatesSnackbarStatus(true);
                // 移除固定延遲，讓 updatesSnackbarStatus 自己處理延遲
            }
        },
        updatesSnackbarStatus(val: boolean) {
            if (!val)
                console.log("updatesSnackbarStatus ", val);
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
        prepareSnackbar(snackbarItem: SnackbarItem) {
            if (!snackbarItem.timeout)
                snackbarItem.timeout = 5000
            // console.log("snackbarItem ", snackbarItem);
            this.snackbarItem = snackbarItem;
        },

        //get query 路徑、欄位名稱、查詢值，開啟loading、延遲關閉loading
        getByQuery(path: string, key: string, value: string, autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
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
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, key, value, " getByQuery!! ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        console.log("autoSaveStatusEnd ", autoSaveStatusEnd);
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //get query 路徑key、複數{欄位名稱key,查詢值value}、、開啟loading、延遲關閉loading
        getByQueryMulti(path: string, jsonArray: QueryItem[] = [], autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            // console.log(jsonArray, "jsonArray ", jsonArray.every(item => Object.prototype.hasOwnProperty.call(item, 'key')));
            // jsonArray.forEach(item => { console.log(item); })

            if (jsonArray.length == 0 && !jsonArray.every(item => Object.prototype.hasOwnProperty.call(item, 'key') && Object.prototype.hasOwnProperty.call(item, 'value'))) {
                globalFunctions.handErrorUtil("getByQueryMulti jsonArray", jsonArray);
                return;
            }
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
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
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, jsonArray, " getByQueryMulti ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //get path 路徑、欄位名稱、查詢值，開啟loading、延遲關閉loading
        getByPath(path: string, valueArray: string[] = [], autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            // if (valueArray.length == 0) {
            //     globalFunctions.handErrorUtil("getByPath valueArray", valueArray);
            //     return;
            // }
            const queryString = valueArray.join('/');
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
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
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, valueArray, " getByPath ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //post body 路徑、object，開啟loading跟延遲關閉
        postByBody(path: string, object: any, autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200, responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document') {
            // console.log("responseType ", responseType);
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
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
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, object, " postByBody ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //post query 路徑key、複數{欄位名稱key,查詢值value}、、開啟loading、延遲關閉loading
        //post 同時支援query跟body兩種方式
        //[ {key:'a1',value:'a2'},{key:'b1',value:'b2'},{body:{...}} ]
        postByQueryMulti(path: string, jsonArray: QueryArrayItem[] = [], autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
            if (jsonArray.length == 0 && !jsonArray.every(item => 'key' in item && 'value' in item)) {
                globalFunctions.handErrorUtil("postByQueryMulti jsonArray", jsonArray);
                return;
            }

            const queryString = jsonArray.filter(item => 'key' in item).map(item => `${(item as QueryItem).key}=${(item as QueryItem).value}`).join('&');
            const bodyItem = jsonArray.find(item => 'body' in item);
            const body = bodyItem ? (bodyItem as BodyItem).body : {}
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
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(fullpath, " postByQueryMulti ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //put body 路徑、object，開啟loading跟延遲關閉
        putByBody(path: string, object: any, autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
            return axios
                .put(
                    this.apiServerUrl + 'api/' + path, object,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, object, " putByBody ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //put query 路徑key、複數{欄位名稱key,查詢值value}、、開啟loading、延遲關閉loading
        //put 同時支援query跟body兩種方式
        //[ {key:'a1',value:'a2'},{key:'b1',value:'b2'},{body:{...}} ]
        putByQueryMulti(path: string, jsonArray: QueryArrayItem[] = [], autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
            if (jsonArray.length == 0 && !jsonArray.every(item => 'key' in item && 'value' in item)) {
                globalFunctions.handErrorUtil("putByQueryMulti jsonArray", jsonArray);
                return;
            }

            const queryString = jsonArray.filter(item => 'key' in item).map(item => `${(item as QueryItem).key}=${(item as QueryItem).value}`).join('&');
            const bodyItem = jsonArray.find(item => 'body' in item);
            const body = bodyItem ? (bodyItem as BodyItem).body : {}
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
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(fullpath, " putByQueryMulti ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },
        //put body 路徑、object，開啟loading跟延遲關閉
        //query同時支援query跟body兩種方式 字串 => path/uuid JSON path?key=value
        //[ {key:'a1',value:'a2'},{key:'b1',value:'b2'}]
        deleteByQuery(path: string, query: string | QueryItem | QueryItem[], autoSaveStatusStart: boolean = true, autoSaveStatusEnd: boolean = true, timeout: number = 200) {
            // const fullpath = typeof query === 'string' ? this.apiServerUrl + 'api/' + path + '/' + query : this.apiServerUrl + 'api/' + path + '?' + query.key + '=' + query.value;
            let fullpath = ''
            if (typeof query === 'string')
                fullpath = this.apiServerUrl + 'api/' + path + '/' + query;
            else if (Array.isArray(query)) {
                const queryString = query.filter(item => Object.prototype.hasOwnProperty.call(item, 'key')).map(item => `${item.key}=${item.value}`).join('&');
                fullpath = this.apiServerUrl + 'api/' + path + '?' + queryString;
            } else if (typeof query === 'object') {
                fullpath = this.apiServerUrl + 'api/' + path + '?' + query.key + '=' + query.value;
            }

            if (autoSaveStatusStart) this.updateAutoSaveStatus(true);
            return axios
                .delete(
                    fullpath,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.apiToken
                        }
                    })
                .then((response) => {
                    if (process.env.NODE_ENV != 'production')
                        console.log(path, query, " deleteByBody ", response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setTimeout(() => {
                        if (autoSaveStatusEnd) this.updateAutoSaveStatus(false);
                    }, timeout);
                })
        },

    }

});