import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IRole extends IBase {
  id: number;
  name: string;
  concurrencyStamp: string;
  updateDate: string;
  updateBy: number;
  createDate: string;
  createBy: number;
}
