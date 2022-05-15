import { Base } from './Base/base.model';

import { IUserInfo } from '../interfaces/userInfo.interface';
import { RoleModel } from './roleModel';
import { IUser } from '../interfaces/user.interface';

/**
 * مدل اطلاعات کاربر
 */
export class UserModel implements IUser {
  username: string;
  password: string;
  // notifications:any[];
}
