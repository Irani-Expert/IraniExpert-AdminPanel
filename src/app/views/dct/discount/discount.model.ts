import { Base } from 'src/app/shared/models/Base/base.model';
import { IDiscount } from './discount.interface';

export class DiscountModel extends Base implements IDiscount {
  id: number;
  createDate: string;
  createBy:string
  code: string;
  expireDate: string;
  amount: number;
  count: number=0;
  percent: number=0;
}
