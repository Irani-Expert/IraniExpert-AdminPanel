import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { IOrder } from './order.interface';

export interface IInvoice extends IBase {
  updateDate: Date;
  createDate: Date;
  order: IOrder[];
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
