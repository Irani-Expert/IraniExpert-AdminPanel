import { CommentModel } from 'src/app/shared/models/comment.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
const noteInit = new CommentModel();
export class CreateNote {
  private createNote = noteInit;
  constructor(
    private text: string = '',
    private user: UserInfoModel,
    private orderID: number = 0
  ) {
    this.createNote.text = this.text;
    this.createNote.userID = this.user.userID;
    this.createNote.name = this.user.firstName + ' ' + this.user.lastName;
    this.createNote.email = this.user.subject;
    this.createNote.isAccepted = true;
    this.createNote.isActive = true;
    this.createNote.parentID = null;
    this.createNote.rowID = this.orderID;
    this.createNote.tableType = 8;
    this.createNote.rate = 5;
  }
  get noteToSend() {
    return this.createNote;
  }
  // item.rate = 1;
  // item.email = this.user.subject;
  // item.name = this.user.firstName + ' ' + this.user.lastName;
  // item.isActive = true;
  // item.rowID = this.noteRowID;
  // item.isAccepted = true;
  // item.tableType = 8;
  // item.parentID = null;
}
