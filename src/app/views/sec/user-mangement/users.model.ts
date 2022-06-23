import { Base } from 'src/app/shared/models/Base/base.model';
import { IUsers } from './users.interface';

export class UsersModel extends Base implements IUsers {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
}
