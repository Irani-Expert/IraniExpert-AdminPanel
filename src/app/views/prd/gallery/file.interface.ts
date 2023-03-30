import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IFile extends IBase  {
  fileExists:boolean
  rowID : number;
  tableType : number;
  filePath:string;
}
