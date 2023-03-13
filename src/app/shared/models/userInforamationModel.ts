import { Base } from './Base/base.model';

import { IUserInfo } from '../interfaces/userInfo.interface';
import { RoleModel } from './roleModel';

/**
 * مدل اطلاعات کاربر
 */
export class UserInforamationModel {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  accountNumber: string;
  password: string;
  subject: string;
}
