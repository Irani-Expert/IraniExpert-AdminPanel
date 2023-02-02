import { IRole } from "./role.interface";



/**
 * اینترفیس اطلاعات کاربر
 */
export interface IConditionModel {
  title: string;
  description: string;
  orderID: number;
  isActive: boolean;
  id: number;
  updateDate:string;
  createDate: string;
  createBy: string;
  updateBy: string;
}
