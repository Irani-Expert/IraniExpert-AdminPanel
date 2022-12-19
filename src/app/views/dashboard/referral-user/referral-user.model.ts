import { Base } from 'src/app/shared/models/Base/base.model';
import { Ireferraluser } from './referral-user.interface';

export class referraluserModel extends Base implements Ireferraluser {
    firstName: string;
    lastName: string;
    phoneNumber: number;
    expireDate:string;
    commission:string;
    RegisterduserNumber:number;
}
