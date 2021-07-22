export interface StockPriceDto {
  id?: number;
  companyCode?: string;
  stockExchangeName?: string;
  price?: number;
  date: string;
  time: string;
}
