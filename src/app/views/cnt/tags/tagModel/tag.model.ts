
import { Base } from 'src/app/shared/models/Base/base.model';
import { Itag } from './tag.interface';

export class tagModel extends Base implements Itag{
  id: number;
  updateDate: string;
  createDate: string;
  createBy: number;
  updateBy: number;
  title: string;
  description: string;
  orderID: number;
  isActive: boolean;
  groupID: number
  groupTitle: string
}


