import { Base } from 'src/app/shared/models/Base/base.model';
import { IReferraluser } from './referral-user.interface';

export class referraluserModel extends Base implements IReferraluser {
    firstName: string;
    lastName: string;
    phoneNumber: number;
    expireDate:string;
    commission:string;
    RegisterduserNumber:number;
}
