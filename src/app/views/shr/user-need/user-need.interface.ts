import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IUserNeed extends IBase {
  firstName: number;
  lastName: string;
  email: string;
  phoneNumber: string;
  text: string;
  userWant: number;
}
