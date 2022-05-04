import { IMenu } from "./menu.interface";
import { IPermission } from "./permission.interface";
import { IUserInfo } from "./userInfo.interface";

/**
 * اینترفیس اطلاعات دسترسی و کاربر
 */
export interface IUserMenu {
  userInfo: IUserInfo;
  menus: IMenu[];
  permissions: IPermission[];
}
