import { Base } from 'src/app/shared/models/Base/base.model';
import { IUserRole } from './user-role.interface';

export class UserRoleModel extends Base implements IUserRole {
  userName: string;
  roleName: string;
  userId: number;
  roleId: number;
  updateBy: number;
  createBy: number;
}
