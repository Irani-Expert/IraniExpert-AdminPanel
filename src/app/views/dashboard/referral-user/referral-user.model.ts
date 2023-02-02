import { Base } from 'src/app/shared/models/Base/base.model';
import { HeaderModel } from 'src/app/shared/models/HeaderModel';
import { ordersModel } from 'src/app/shared/models/ordersModel';
import { IReferraluser } from './referral-user.interface';

export class referraluserModel extends Base implements IReferraluser {
        header:HeaderModel;
        orders:ordersModel[];
     
}
