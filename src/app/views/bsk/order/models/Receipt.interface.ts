import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IReceipt extends IBase {
  contractID: number;
  paymentDate:string,
  serialNumber: string,
  price: number,
  companyPaid: true,
  paymentStep: number,
  description: string,
}
