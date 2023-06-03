import { Base } from 'src/app/shared/models/Base/base.model';
import { IBanner } from './banner.interface';

export class BannerModel extends Base implements IBanner {
  isRTL: boolean;
  type: number;
  linkType: number;
  filePath: string;
  fileType: number;
  fileInfo: string;
  fileExists: boolean;
  tableType: number;
  rowID: number;
  url: string;
}
