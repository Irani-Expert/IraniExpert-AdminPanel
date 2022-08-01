import { Base } from 'src/app/shared/models/Base/base.model';
import { ILicense } from './license.interface';

export class LicenseModel extends Base implements ILicense {
  updateDate: string;
  createDate: string;
  file: string;
  userID: number;
  startDate: Date;
  expireDate: Date;
  rowID: number;
  accountNumber: number;
}
