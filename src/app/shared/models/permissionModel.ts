import { IPermission } from '../interfaces/permission.interface';

/**
 * مدل دسترسی
 */
export class PermissionModel implements IPermission{
  formId: number;
  formTitle: string;
  icon: string;
  action: string;
  subSystemTitle: string
  menuId: number;
}
