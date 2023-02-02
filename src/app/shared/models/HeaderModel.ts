


import { IHeader } from '../interfaces/Header.interface';

/**
 * مدل اطلاعات کاربر
 */
export class HeaderModel implements IHeader {
  commission: number;
  referralCode:number;
  title: string;
  firstName: string;
  lastName: string
}
