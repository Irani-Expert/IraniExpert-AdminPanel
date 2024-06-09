export interface FilterDiscount {
  id: number;
  tableType: number;
  rowID: number;
  userID: number;
  code: string;
  isUsed: boolean;

  fromAmount: number;
  toAmount: number;

  fromPercent: number;
  toPercent: number;

  fromCreateDate: string;
  toCreateDate: string;

  fromExpireDate: string;
  toExpireDate: string;
}
