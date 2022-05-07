import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IOrders extends IBase{
  productID:number;
  product:string;
  planID:number;
  plan:string;
  userID:number;
  transactionStatus:number;
}

