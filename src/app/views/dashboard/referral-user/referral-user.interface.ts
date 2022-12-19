import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface Ireferraluser extends IBase {
    firstName: string;
    lastName: string;
    phoneNumber: number;
    expireDate:string;
    commission:string;
    RegisterduserNumber:number;
}
