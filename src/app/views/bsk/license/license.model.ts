import { Base } from 'src/app/shared/models/Base/base.model';
import { ILicense } from './license.interface';

export class LicenseModel extends Base implements ILicense {
  updateDate: string;
  createDate: string;
  filePath: string;
  userID: number;
  startDate: string;
  expireDate: string;
  rowID: number;
  accountNumber: number;
}
