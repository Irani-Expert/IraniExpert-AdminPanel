
import { Base } from 'src/app/shared/models/Base/base.model';
import { IGroup } from './group.interface';

export class GroupModel extends Base implements IGroup{
  parentID: number;
  parentGroupTitle: string;
  type: number;
  iconKey: string;
  cardImagePath: string;

}


