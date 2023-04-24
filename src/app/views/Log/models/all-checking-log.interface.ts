export interface IAllCheckingLog {
    id: number;
    title: string;
    description: string;
    orderID: number;
    isActive: boolean;
    actionDescriptor: string;
    requestType: number;
    tableType: number;
}
