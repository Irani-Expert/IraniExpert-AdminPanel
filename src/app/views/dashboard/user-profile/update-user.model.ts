import { IUpdateUser } from "./update-user.interface";

export class UpdateUser implements IUpdateUser {
    id: number;
    salt: string;
    customClaim: string;
    accountNumber: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    acceptRules: boolean;
    referralCode: string
}
