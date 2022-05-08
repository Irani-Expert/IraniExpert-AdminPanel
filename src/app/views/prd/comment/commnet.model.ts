import { Base } from "src/app/shared/models/Base/base.model";
import { IComment } from "./comment.interface";


export class CommentModel extends Base implements IComment {
  userID: number;
  parentID: number;
  parentComment: string;
  TableType: number;
  RowID: number;
  name: string;
  email: string;
  rate: number;
  text: string;
  isAccepted: boolean;

}
