import { Base } from 'src/app/shared/models/Base/base.model';
import { ILicense } from './license.interface';

export class CliamxLicenseModel  {
  file: any;
  startDate: string;
  expireDate: string;
  accountNumber: string;
  licenseId:number;
}

export class CliamxResponse  {
  data: any;
  message: any;
  statusCode: any;
  error: any;
 }


