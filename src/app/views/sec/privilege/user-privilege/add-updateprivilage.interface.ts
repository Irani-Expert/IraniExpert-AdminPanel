import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IAddUpdateprivilage extends IBase{
    id: number,
    userID: number,
    roleID: number,
    privilageID: number
}
