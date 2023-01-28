import { Base } from './Base/base.model';

import { IUserInfo } from '../interfaces/userInfo.interface';
import { RoleModel } from './roleModel';
import { IUser } from '../interfaces/user.interface';
import { IUserBaseInfo } from '../interfaces/userBaseInfo.interface';

/**
 * مدل اطلاعات کاربر
 */
export class UserBaseInfoModel implements IUserBaseInfo {
  userID: number;
  firstname: string;
  lastName: string;
}
