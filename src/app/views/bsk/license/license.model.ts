import { Base } from 'src/app/shared/models/Base/base.model';
import { ILicense } from './license.interface';

export class LicenseModel implements ILicense {
  fileExists: boolean;
  filePath: string;
  startDate: string;
  expireDate: string;
  rowID: number;
  versionNumber: number;
}
