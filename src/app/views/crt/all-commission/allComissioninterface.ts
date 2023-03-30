import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IallComission extends IBase {
  commission: number;
  contractID: number;
  firstName: number;
  lastName: string;
  remainCommission: number;
}
