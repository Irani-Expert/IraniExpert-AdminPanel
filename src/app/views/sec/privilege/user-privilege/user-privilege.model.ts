import { Base } from 'src/app/shared/models/Base/base.model';
import { IUserPrivilege } from './user-privilege.interface';

export class UserPrivilegeModel extends Base implements IUserPrivilege {
  userID: number;
  userName: string;
  roleID: number;
  role: string;
  privilageID: number;
  privilege: string;
}
