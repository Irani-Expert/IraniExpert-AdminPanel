export interface IAddOrder {
  orderItems: OrderItemBasket[];
  accountNumber: string;
  acceptRules: boolean;
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
export interface OrderItemBasket {
  title?: string;
  tableType: number;
  rowID: number;
  count: number;
  price: number;
}
