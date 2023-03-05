import { Base } from './Base/base.model';

import { IUserInfo } from '../interfaces/userInfo.interface';
import { RoleModel } from './roleModel';
import { IUser } from '../interfaces/user.interface';
import { IUserRoles } from '../interfaces/userRoles.interface';

/**
 * مدل اطلاعات کاربر
 */
export class UserRolesModel implements IUserRoles {
  id: number=0;
  updateDate: string;
  createDate:string;
  userId: number;
  roleId:number 
}
