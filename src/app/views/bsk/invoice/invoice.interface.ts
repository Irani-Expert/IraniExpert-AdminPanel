import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { OrderModel } from '../order/order.model';

export interface IInvoice extends IBase {
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
}
