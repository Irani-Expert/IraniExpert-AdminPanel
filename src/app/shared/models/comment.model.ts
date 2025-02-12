import { Base } from 'src/app/shared/models/Base/base.model';
import { IComment } from '../interfaces/comment.interface';

export class CommentModel extends Base implements IComment {
  userID: number;
  parentID: number;
  parentComment: CommentModel[];
  tableType: number;
  rowID: number;
  name: string;
  email: string;
  rate: number;
  text: string = '';
  isAccepted: boolean;
  jalaliDate: string;
  createDate: Date;
}
