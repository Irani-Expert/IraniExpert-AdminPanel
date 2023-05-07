export interface IUpdateUser  {
    id: number,
    salt: string,
    customClaim: string,
    accountNumber: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    emailConfirmed: boolean,
    phoneNumber: string,
    phoneNumberConfirmed: boolean,
    acceptRules: boolean,
    referralCode: string
}
