import { Base } from 'src/app/shared/models/Base/base.model';
import { IPlanOption } from './plan-option.interface';
export class PlanOptionModel extends Base implements IPlanOption {
  planID: number;
  plan: string;
  price: number;
  iconPath: string;
}

