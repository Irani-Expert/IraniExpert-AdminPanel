


import { Iorders } from '../interfaces/orders.interface';

/**
 * مدل اطلاعات کاربر
 */
export class ordersModel implements Iorders {
  id: number;
  productID: number;
  planID: number;
  price: number;
  accountNumber: string;
  firstName: string
  lastName:string;
  expireDate: string;
}
