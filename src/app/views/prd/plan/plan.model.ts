import { Base } from 'src/app/shared/models/Base/base.model';
import {  IPlan } from './plan.interface';

export class PlanModel extends Base implements IPlan {
  productId: number;
  product: string;
  price: number;
  expireDate: Date;
  iconPath: string;
}



