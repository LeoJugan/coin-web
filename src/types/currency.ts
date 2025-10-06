// 幣別資料介面
export interface CurrencyData {
  id: string
  code: string
  name: string
  symbol: string
  rate: string
  rateFloat: number | null
  description: string
  modifyDate?: string
}

// 幣別歷史資料介面
export interface CurrencyHistData extends CurrencyData {
  type?: string
}

