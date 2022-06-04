import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { PlanModel } from '../../bas/plan/plan.model';

export interface IOrder extends IBase {
  productId: number;
  product: string;
  price: number;
  userID: number;
  transactionStatus: number;
  planID: PlanModel[];
}
