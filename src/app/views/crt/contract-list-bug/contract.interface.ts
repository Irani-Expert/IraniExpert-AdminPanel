import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IContract extends IBase {
  id: number;
  title: string;
  orderID:number; 
  sellingType: 0
  fromDate: string;
  toDate: string;
  prcentReward: number;
  userID: number;
  roleID: number;
}
