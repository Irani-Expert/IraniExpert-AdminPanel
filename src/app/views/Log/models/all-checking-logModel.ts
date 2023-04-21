import { IAllCheckingLog } from "./all-checking-log.interface";

export class AllCheckingLog  implements IAllCheckingLog{
    id: number;
    title: string;
    description: string;
    orderID: number;
    isActive: boolean;
    actionDescriptor: string;
    requestType: number;
    tableType: number;
}
