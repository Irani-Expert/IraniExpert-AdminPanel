import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IComment extends IBase{
  userID:number;
  parentID:number;
  parentComment:string;
  TableType:number;
  RowID:number;
  name:string;
  email:string;
  rate:number;
  text:string;
  isAccepted:boolean;
}
