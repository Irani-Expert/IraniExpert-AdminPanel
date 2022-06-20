import { IBase } from 'src/app/shared/interfaces/Base/base.interface';


export interface IOrder extends IBase {
  plan:string;
  planID: number;
  price: number;
  product: string;
  productID: number
  transactionStatus: number
  updateDate:string;
  userID: number
  userInfo:any;
}
