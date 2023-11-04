import { IAddOrder } from './AddOrder.interface';

export class AddOrderModel implements IAddOrder {
  orderItems: [
    { tableType: number; rowID: number; count: number; price: number }
  ];
  accountNumber: string;
  acceptRules: true;
  startDate: string;
  transactionCode: string;
  discountCode: string;
  token: string;
  totalPrice: number;
  userID: number;
  discountPrice: number;
  toPayPrice: number;
  paymentStatus: number;
  clientID: number;
  code: string;
  transactionStatus: number;
  ipAddress: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
