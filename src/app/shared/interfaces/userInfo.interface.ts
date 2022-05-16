import { IRole } from "./role.interface";



/**
 * اینترفیس اطلاعات کاربر
 */
export interface IUserInfo {
  token: string;
  refreshToken: string;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
}
