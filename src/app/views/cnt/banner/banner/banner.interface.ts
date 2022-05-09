
import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IBanner extends IBase{
  type:number;
  linkType:number;
  filePath:string;
  fileType:number;
  fileInfo:string;
  tableType:number;
  rowID:number;
  url:string;

}



