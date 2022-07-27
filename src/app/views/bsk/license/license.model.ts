import { Base } from 'src/app/shared/models/Base/base.model';
import { ILicense } from './license.interface';

export class LicenseModel extends Base implements ILicense {
  id: number;
  updateDate: string;
  createDate: string;
  title: string;
  description: string;
  orderID: number;
  isActive: boolean;
  file: string;
  userID: number;
  startDate: string;
  expireDate: string;
}
