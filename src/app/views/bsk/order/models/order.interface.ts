import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IOrder extends IBase {
  planTitle: string;
  planID: number;
  price: number;
  productTitle: string;
  productID: number;
  transactionStatus: number;
  updateDate: string;
  userID: number;
  phoneNumber: number;
  firstName: string;
  lastName: string;
  accountNumber: number;
  expireDate: string;
  createDate: string;
  versionNumber: number;
  filePath: string;
  licenseID: number;
  toPayPrice: number;
  startDate: string;
  bankResponse: string;
  code: string;
  maximumBalance: number;
  referralCode: string;
  jalaliDate: string;
  commentCount: number;
}
