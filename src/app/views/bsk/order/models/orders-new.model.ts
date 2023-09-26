import { BehaviorSubject } from 'rxjs';

export class TableModel<T> {
  headers: string[];
  data: T;
}
export class OrdersModel {
  id = 0;
  createDate = '';
  productTitle = '';
  planTitle = '';
  maximumBalance = 0;
  accountNumber = '';
  firstName = '';
  lastName = '';
  transactionStatus = 0;
  expireDate = '';
  code = '';
  commentCount = 0;
  hijriCreateDate = '';
}
export class SingleOrderModel {
  orderDetails = new OrderDetail();
  items = new Array<OrderDetailItem>();
}
class OrderDetail extends OrdersModel {
  startDate = '';
  versionNumber = '';
  licenseID = 0;
  peresentorFName = '';
  peresentorLName = '';
  totalPrice = 0;
  discountPrice = 0;
  toPayPrice = 0;
  bankResponse = '';
  phoneNumber = '';
  description = '';
}
class OrderDetailItem {
  id = 0;
  tableType = 0;
  rowID = 0;
  count = 0;
  unitPrice = 0;
  totalPrice = 0;
  discountPrice = 0;
  toPayPrice = 0;
}
type DetailHeader = { value: string | number; key: string };
export class OrderDetailHeader {
  header = new Array<DetailHeader>();
  constructor(detailItem: OrderDetail) {
    Object.keys(detailItem).forEach((key) => {
      this.header.push({ value: detailItem[key], key: key });
    });
  }
}
