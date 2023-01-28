import { Base } from 'src/app/shared/models/Base/base.model';
import { IContract } from './contract.interface';

export class ContractModel extends Base implements IContract {
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
