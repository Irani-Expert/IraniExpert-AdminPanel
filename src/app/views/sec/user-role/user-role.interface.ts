import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IUserRole {
  userId: number;
  userName: string;
  roleName: string;
  roleId: number;
  updateBy: number;
  createBy: number;
}
