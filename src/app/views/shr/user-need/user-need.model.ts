import { Base } from 'src/app/shared/models/Base/base.model';
import { IUserNeed } from './user-need.interface';

export class UserNeedModel extends Base implements IUserNeed {
  firstName: number;
  lastName: string;
  email: string;
  phoneNumber: string;
  text: string;
  userWant: number;
}
