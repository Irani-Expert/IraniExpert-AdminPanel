import { IAllCheckingLog } from "./all-checking-log.interface";

export class AllCheckingLog  implements IAllCheckingLog{
    id: number;
    title: string;
    description: string;
    orderID: number=0;
    isActive: boolean;
    actionDescriptor: string;
    requestType: number;
    tableType: number;
    createDate:string;
    updateDate:string;
    loggingCount:number;
}
