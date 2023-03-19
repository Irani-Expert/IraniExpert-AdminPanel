import { Base } from 'src/app/shared/models/Base/base.model';
import { IFile } from './file.interface';

export class FileModel extends Base implements IFile {
  rowID: number;
  tableType: number;
  filePath: string;
  isFileExist: boolean = false;
}
