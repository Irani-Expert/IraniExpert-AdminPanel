import { Base } from 'src/app/shared/models/Base/base.model';
import { IFile } from './file.interface';

export class FileModel extends Base implements IFile {
  type: number;
  key: string;
  fileType: number;
  fileInfo: string;
  stationID: number;
  fileExists: boolean;
  rowID: number;
  tableType: number;
  filePath: string;
}
