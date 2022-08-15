import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IUserRole extends IBase {
  userId: number;
  userName: string;
  roleName: string;
  roleId: number;
  updateBy: number;
  createBy: number;
}
