import { UserDataModel } from "./UserData.model";

export class TreeNode<T = any> {
    label?: string;
    data?: UserDataModel;
    icon?: string;
    expandedIcon?: any;
    collapsedIcon?: any;
    children: TreeNode<T>[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode<T>;
    parentId?: number;
    partialSelected?: boolean;
    style?: string;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
    title:string
    id:number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    accountNumber: number;
    totalPayment: number;
}
