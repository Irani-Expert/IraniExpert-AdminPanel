
import { Base } from 'src/app/shared/models/Base/base.model';
import { IBanner } from './banner.interface';

export class BannerModel extends Base implements IBanner{
  type: number;
  linkType: number;
  filePath: string;
  fileType: number;
  fileInfo: string;
  tableType: number;
  rowID: number;
  url: string;
  startCource: Date;
  endCource: Date;

}




