import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface ILicense extends IBase {
  updateDate: string;
  createDate: string;
  file: string;
  userID: number;
  startDate: string;
  expireDate: string;
}
