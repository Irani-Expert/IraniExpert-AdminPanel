import { Base } from 'src/app/shared/models/Base/base.model';
import { PlanModel } from '../../bas/plan/plan.model';
import { IOrder } from './order.interface';

export class OrderModel extends Base implements IOrder {
  productId: number;
  product: string;
  price: number;
  userID: number;
  transactionStatus: number;
  planID: PlanModel[];
}
