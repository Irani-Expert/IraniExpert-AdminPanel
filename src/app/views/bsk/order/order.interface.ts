import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { IInvoice } from '../invoice/invoice.interface';

export interface IOrder extends IBase {
  plan: string;
  planID: number;
  price: number;
  product: string;
  productID: number;
  transactionStatus: number;
  updateDate: string;
  userID: number;
  phoneNumber: number;
  firstName: string;
  lastName: string;
  accountNumber: number;
}
