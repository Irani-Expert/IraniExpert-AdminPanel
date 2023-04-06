import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IAddOrder extends IBase {
  id:number,
  orderID: number,
  isActive: boolean,
  userID: number,
  token: string,
  productID: number,
  planID: number,
  price: number,
  email: string,
  accountNumber: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  transactionCode: string,
  discountPrice: number,
  bankType: number;
  isGenerated:boolean

}
