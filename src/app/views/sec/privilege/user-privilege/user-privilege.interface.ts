import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IUserPrivilege extends IBase {
  id: number;
  userID: number;
  userName: string;
  roleID: number;
  role: string;
  privilageID: number;
  privilege: string;
}
