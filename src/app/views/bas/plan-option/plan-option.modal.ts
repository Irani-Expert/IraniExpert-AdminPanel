import { Base } from 'src/app/shared/models/Base/base.model';
import { IPlanOption } from './plan-option.interface';
export class PlanOptionModal extends Base implements IPlanOption {
  productId: number;
  product: string;
  price: number;
  expireDate: Date;
  iconPath: string;
  planOption: string;
}