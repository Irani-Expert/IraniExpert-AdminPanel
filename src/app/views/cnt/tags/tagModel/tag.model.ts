import { GroupId, Itag } from './tag.interface';

export class tagModel implements Itag {
  id: number;
  updateDate: string;
  createDate: string;
  createBy: number;
  updateBy: number;
  title: string;
  description: string;
  orderID: number;
  isActive: boolean;
  groupID: number;
  groupTitle: string;
  isSharp : boolean;
}

export class GroupIdModel implements GroupId {
  title : string;
  value : number;
}
