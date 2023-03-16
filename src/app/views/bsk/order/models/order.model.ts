import { Base } from 'src/app/shared/models/Base/base.model';
import { IOrder } from './order.interface';

export class OrderModel extends Base implements IOrder {
  phoneNumber: number;
  firstName: string;
  lastName: string;
  accountNumber: number;
  plan: string;
  planID: number;
  price: number;
  product: string;
  productID: number;
  transactionStatus: number;
  updateDate: string;
  userID: number;
  userInfo: any;
  startDate: string;
  expireDate: string;
  createDate: string;
  versionNumber: number;
  filePath: string;
  licenseID: number;
  clientId: number;
  toPayPrice: number;
  bankResponse: string;
  code: string;
  maximumBalance: number;
  referralCode: string;
  jalaliDate: string;
}
