
import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface ILearn extends IBase{
  productID:number;
  product:string;
  videoUrl:string;
  fileUrl:string;
  tableType:string;
  rowID:number

}



