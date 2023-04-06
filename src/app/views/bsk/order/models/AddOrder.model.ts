import { Base } from 'src/app/shared/models/Base/base.model';
import { IAddOrder } from './AddOrder.interface';


export class AddOrderModel extends Base implements IAddOrder {
  id:number=0;
  orderID: number=0;
  isActive: boolean=true;
  userID: number;
  token: string;
  productID: number;
  planID: number;
  price: number;
  email: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  transactionCode: string;
  discountPrice: number;
  bankType: number=0;
  isGenerated:boolean=false;
}
