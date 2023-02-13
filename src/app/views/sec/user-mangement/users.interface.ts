import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IUsers extends IBase {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
