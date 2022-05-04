import { IRole } from "./role.interface";



/**
 * اینترفیس اطلاعات کاربر
 */
export interface IUserInfo {
  username: string;
  firstname: string;
  lastname: string;
  guid: string;
  branch: number;
  currentDate: number;
  id: number;
  role: IRole;
  fK_Organization_Id: number;
  fK_Organization_Title:string;
  // notifications:[];
}
