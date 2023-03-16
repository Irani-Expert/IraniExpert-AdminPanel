import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface ICommission extends IBase {
  commission: number;
  header: [
    {
      contractID: number;
      commission: number;
      contractTitle: string;
    }
  ];
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
