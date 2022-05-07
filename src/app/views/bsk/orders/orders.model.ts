
import { Base } from 'src/app/shared/models/Base/base.model';
import { IOrders } from './orders.interface';

export class OrdersModel extends Base implements IOrders{
  productID: number;
  product: string;
  planID: number;
  plan: string;
  userID: number;
  transactionStatus: number;
}


