import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IBackTest extends IBase{
  ProductID:number;
  product:string;
  VideoUrl:string;
  FileUrl:string;
  TableType:string;
  RowID:number;
  UpdateDate:Date;
  UpdateBy:string;
  CreateDate:Date;
  CreateBy:string;
}

