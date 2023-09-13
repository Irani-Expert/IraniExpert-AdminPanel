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
