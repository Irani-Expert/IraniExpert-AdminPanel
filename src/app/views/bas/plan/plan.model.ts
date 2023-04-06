import { Base } from 'src/app/shared/models/Base/base.model';
import { PlanOptionModel } from '../plan-option/plan-option.model';
import { IPlan } from './plan.interface';
export class PlanModel extends Base implements IPlan {
  id: number;
  title: string;
  productId: number;
  product: string;
  price: number;
  expireDate: Date;
  iconPath: string;
  planOptions: PlanOptionModel[];
  isFirstBuy: boolean;
}
