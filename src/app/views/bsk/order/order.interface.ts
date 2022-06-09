import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { PlanModel } from '../../bas/plan/plan.model';

export interface IOrder extends IBase {
  firstName: string;
  lastName: string;
  userID: number;
  transactionStatus: number;
  planID: PlanModel[];
}
