import { Ireferral } from '../interfaces/referral.interface';

export class referralModel implements Ireferral {
  firstname: string;
  lastName: string;
  userID: number;
}
