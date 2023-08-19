import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface Itag extends IBase{
  id: number;
  updateDate: string;
  createDate: string;
  createBy: number;
  updateBy: number;
  title: string;
  description: string;
  orderID: number;
  isActive: boolean;
  groupID: number
  groupTitle: string
}
