import { IAddOrder } from './AddOrder.interface';

export class AddOrderModel implements IAddOrder {
  orderItems: [
    { tableType: number; rowID: number; count: number; price: number }
  ];
  accountNumber: string = null;
  acceptRules: boolean = true;
  startDate: string = null;
  transactionCode: string = null;
  discountCode: string;
  token: string = null;
  totalPrice: number = null;
  userID: number = null;
  discountPrice: number = null;
  toPayPrice: number = null;
  paymentStatus: number;
  clientID: number = null;
  code: string;
  transactionStatus: number;
  ipAddress: string;
  email: string = null;
  firstName: string = null;
  lastName: string = null;
  phoneNumber: string = null;
}
