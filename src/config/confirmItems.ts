import type { ConfirmItem } from '@/types/common'

// 新增確認項目
export const confirmItemAdd: ConfirmItem = {
  title: "新增確認",
  content: "是否確認新增此筆資料？",
  btnText: "確認新增",
  color: "green-darken-1",
  snackbarText: "資料已新增",
  cancelBtnFlag: true
}

// 更新確認項目
export const confirmItemUpdate: ConfirmItem = {
  title: "更新確認",
  content: "是否確認更新此筆資料？",
  btnText: "確認更新",
  color: "blue-darken-1",
  snackbarText: "資料已更新",
  cancelBtnFlag: true
}

// 還原資料確認項目
export const confirmItemInit: ConfirmItem = {
  title: "更新確認",
  content: "是否確認還原資料？",
  btnText: "確認更新",
  color: "blue-darken-1",
  snackbarText: "資料已更新",
  cancelBtnFlag: true
}

// 刪除確認項目
export const confirmItemRemove: ConfirmItem = {
  title: "刪除確認",
  content: "是否確認刪除此筆資料？",
  btnText: "確認刪除",
  color: "red",
  snackbarText: "資料已刪除",
  cancelBtnFlag: true
}

// 預設確認項目
export const defaultConfirmItem: ConfirmItem = {
  title: "請確認變更",
  content: "確認變更後，將進行資料更新",
  btnText: "確認變更",
  color: "primary",
  snackbarText: "資料已更新",
  cancelBtnFlag: true
}
