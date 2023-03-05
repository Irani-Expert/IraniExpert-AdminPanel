import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface ILicense extends IBase {
  updateDate: string;
  createDate: string;
  filePath: string;
  userID: number;
  startDate: string;
  expireDate: string;
  rowID: number;
  accountNumber: number;
  versionNumber: number;
}
