import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IContract extends IBase {
  id: number;
  title: string;
  orderID:number; 
  sellingType: number
  sellingTypeTitle:string;
  fromDate: string;
  toDate: string;
  prcentReward: number;
  userID: number;
  roleID: number;
}
