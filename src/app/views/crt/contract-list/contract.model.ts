import { Base } from 'src/app/shared/models/Base/base.model';
import { IContract } from './contract.interface';

export class ContractModel extends Base implements IContract {
  id: number;
  title: string;
  orderID:number; 
  sellingType: number
  sellingTypeTitle:string
  fromDate: string;
  toDate: string;
  prcentReward: number;
  userID: number;
  roleID: number;
  conditions:number[]=new Array<number>();
}
