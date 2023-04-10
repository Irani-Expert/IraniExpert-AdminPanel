import { IUserReferral } from '../interfaces/userReferral.interface';
import { Base } from './Base/base.model';

export class UserReferralModel extends Base implements IUserReferral {
  // updateDate: string;
  // createDate: string;
  // createBy: number;
  // updateBy: number;
  // amount: number;
  // financialActivity: boolean;
  // robotUsage: boolean;

  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  userWant: number;
}
