import { Base } from 'src/app/shared/models/Base/base.model';
import { ICommission } from './commission.interface';

export class CommissionModel extends Base implements ICommission {
  commission: number;
  contractID: number;
  header: [{ contractID: number; commission: number }];
  orders: [
    {
      id: number;
      productID: number;
      planID: number;
      price: number;
      toPayPrice: number;
      accountNumber: string;
      firstName: string;
      lastName: string;
      expireDate: string;
    }
  ];
}
