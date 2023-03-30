import { IFilter } from '../../interfaces/Base/filter.interface';

export class FilterModel implements IFilter {
  parentID: number;
  rowID: number;
  name: string;
  email: string;
  rate: number;
  isAccepted: boolean;
  iD: number;
  firstName: string;
  lastName: string;
  accountNumber: string;
  fromCreateDate: string;
  toCreateDate: string;
  phoneNumber: string;
  planID: number;
  productID: number;
  code: string;
  fromStartDate: string;
  toStartDate: string;
  fromExpireDate: string;
  toExpireDate: string;
  versionNumber: number;
  userID: number;
  amount: number;
  financialActivity: boolean;
  robotUsage: boolean;
}
