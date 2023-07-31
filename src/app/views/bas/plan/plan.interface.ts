import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { PlanOptionModel } from '../plan-option/plan-option.model';

export interface IPlan extends IBase {
  id: number;
  title: string;
  productId: number;
  product: string;
  price: number;
  expireDate: Date;
  iconPath: string;
  planOptions: PlanOptionModel[];
  isFirstBuy: boolean;
  bgColor: string;
  textColor: string;
  planType: number;
}
