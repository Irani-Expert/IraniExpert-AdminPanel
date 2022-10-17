import { Base } from 'src/app/shared/models/Base/base.model';
import { OrderModel } from '../order/order.model';
import { IInvoice } from './invoice.interface';

export class InvoiceModel extends Base implements IInvoice {
  updateDate: Date;
  createDate: Date;
  order: OrderModel[];
  guid: string;
  code: string;
  totalPrice: number;
  discountPrice: number;
  toPayPrice: number;
  status: number;
  bankType: number;
  bankResponse: string;
  bankResponseDate: Date;
  backMethodType: number;
  isConfirmed: boolean;
  tableType: number;
  userID:number;
}
