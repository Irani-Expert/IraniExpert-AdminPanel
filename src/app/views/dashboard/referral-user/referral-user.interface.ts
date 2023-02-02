import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { HeaderModel } from 'src/app/shared/models/HeaderModel';
import { ordersModel } from 'src/app/shared/models/ordersModel';

export interface IReferraluser extends IBase {
        header:HeaderModel;
        orders:ordersModel[];
}
