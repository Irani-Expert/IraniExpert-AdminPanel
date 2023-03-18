import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface ICommission extends IBase {
  commission: number;
  header: {
    contractID: number;
    allCommission: number;
    contractTitle: string;
  };
  orders: [
    {
      id: number;
      productTitle: number;
      planTitle: number;
      price: number;
      toPayPrice: number;
      accountNumber: string;
      firstName: string;
      lastName: string;
      expireDate: string;
    }
  ];
}
