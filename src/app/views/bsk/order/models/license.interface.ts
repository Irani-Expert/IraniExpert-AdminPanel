import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface ILicense {
  filePath: string;
  startDate: string;
  expireDate: string;
  rowID: number;
  versionNumber: number;
  fileExists: boolean;
}
