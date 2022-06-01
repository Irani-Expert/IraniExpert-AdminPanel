import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { PlanOptionModel } from '../plan-option/plan-option.model';

export interface IPlan extends IBase {
  productId: number;
  product: string;
  price: number;
  expireDate: Date;
  iconPath: string;
  planOptions: PlanOptionModel[];
}
