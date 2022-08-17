import { Base } from './Base/base.model';

import { IUserInfo } from '../interfaces/userInfo.interface';
import { RoleModel } from './roleModel';

/**
 * مدل اطلاعات کاربر
 */
export class UserInfoModel implements IUserInfo {
  username: string;
  firstName: string;
  lastName: string;
  token: string;
  refreshToken: string;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
}
