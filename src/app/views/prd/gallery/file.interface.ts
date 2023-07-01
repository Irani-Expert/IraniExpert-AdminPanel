import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IFile extends IBase {
  fileExists: boolean;
  rowID: number;
  tableType: number;
  filePath: string;
  type: number;
  key: string;
  fileType: number;
  fileInfo: string;
  stationID: number;
}
