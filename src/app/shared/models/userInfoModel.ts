import { Base } from './Base/base.model';

import { IUserInfo } from "../interfaces/userInfo.interface";
import { RoleModel } from "./roleModel";

/**
 * مدل اطلاعات کاربر
 */
export class UserInfoModel implements IUserInfo{
  username: string;
  firstname: string;
  lastname: string;
  guid: string;
  branch: number;
  currentDate: number;
  id: number;
  role: RoleModel;
  fK_Organization_Id: number;
  fK_Organization_Title:string;
  organizations:Base[];
  // notifications:any[];
}
