import { Base } from 'src/app/shared/models/Base/base.model';
import { RoleModel } from '../role-mangement/role.model';
import { IUsers } from './users.interface';

export class UsersModel extends Base implements IUsers {
  userName: string;
  userId:number
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountNumber:string;
  isActive:boolean;
  signUpDate:string;
  persianSignUpDate:string;
  fromSignUpDate:string;
  referralCode:string
  roles:RoleModel[]
}
