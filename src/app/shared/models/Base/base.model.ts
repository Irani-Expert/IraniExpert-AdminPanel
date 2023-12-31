import { IBase } from '../../interfaces/Base/base.interface';

export class Base implements IBase {
  title: string;
  id: number;
  description: string;
  orderID: number;
  isActive: boolean = null;
}
