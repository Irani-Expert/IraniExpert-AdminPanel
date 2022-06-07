import { Base } from 'src/app/shared/models/Base/base.model';
import { IComment } from './comment.interface';

export class CommentModel extends Base implements IComment {
  userID: number;
  parentID: number;
  parentComment: string;
  tableType: number;
  rowID: number;
  name: string;
  email: string;
  rate: number;
  text: string;
  isAccepted: boolean;
}
