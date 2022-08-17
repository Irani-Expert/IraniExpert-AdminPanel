import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IPrivilege extends IBase {
  parentID: number;
  key: string;
}
