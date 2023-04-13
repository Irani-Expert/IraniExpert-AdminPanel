import { Base } from "src/app/shared/models/Base/base.model";

export class UserDataModel{
    userID: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    accountNumber: number;
    totalPayment: number;
    parentUserID:number;
    childsCount:number;
}
