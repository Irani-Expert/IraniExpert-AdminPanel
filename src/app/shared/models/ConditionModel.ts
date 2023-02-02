import { Base } from './Base/base.model';

import { IUserInfo } from '../interfaces/userInfo.interface';
import { RoleModel } from './roleModel';
import { IUser } from '../interfaces/user.interface';
import { IUserBaseInfo } from '../interfaces/userBaseInfo.interface';
import { IConditionModel } from '../interfaces/Condition.interface';

/**
 * مدل اطلاعات کاربر
 */
export class ConditionModel implements IConditionModel {
  title: string;
  description: string;
  orderID: number=0;
  isActive: boolean=true;
  id: number;
  updateDate:string;
  createDate: string;
  createBy: string;
  updateBy: string;
}
