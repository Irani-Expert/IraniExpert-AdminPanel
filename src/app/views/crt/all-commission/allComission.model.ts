import { Base } from 'src/app/shared/models/Base/base.model';
import { IallComission } from './allComissioninterface';

export class allComissionModel extends Base implements IallComission {
  commission: number;
  contractID: number;
  firstName: number;
  lastName: string;
  remainCommission: number;
}
