import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IReferraluser extends IBase {
    firstName: string;
    lastName: string;
    phoneNumber: number;
    expireDate:string;
    commission:string;
    RegisterduserNumber:number;
}
