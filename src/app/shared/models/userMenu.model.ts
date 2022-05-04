import { IUserMenu } from "../interfaces/userMenu.interface";
import { MenuModel } from "./menuModel";
import { PermissionModel } from "./permissionModel";
import { UserInfoModel } from "./userInfoModel";



/**
 * مدل اطلاعات دسترسی و کاربر
 */
export class UserMenuModel implements IUserMenu {
  userInfo: UserInfoModel;
  menus: MenuModel[];
  permissions: PermissionModel[];
}






