import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { RoleModel } from '../role-mangement/role.model';

export interface IUsers extends IBase {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountNumber:string;
  signUpDate:string;
  isActive:boolean;
  roles:RoleModel[]
}
