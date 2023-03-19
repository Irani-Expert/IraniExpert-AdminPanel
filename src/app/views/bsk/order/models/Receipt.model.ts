import { Base } from 'src/app/shared/models/Base/base.model';
import { IOrder } from './order.interface';
import { IReceipt } from './Receipt.interface';

export class ReceiptModel extends Base implements IReceipt {
  contractID: number;
  paymentDate:string;
  serialNumber: string=null;
  price: number=0;
  companyPaid: true;
  paymentStep: number;
  description: string;


}
