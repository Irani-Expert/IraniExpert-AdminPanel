export interface FilterDiscount {
  id: number;
  percent: number;
  tableType: number;
  rowID: number;
  userID: number;
  code: string;
  isUsed: boolean;
  amount: number;
  fromCreateDate: string;
  toCreateDate: string;

  fromExpireDate: string;
  toExpireDate: string;
}
