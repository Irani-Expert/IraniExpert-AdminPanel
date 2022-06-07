import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IComment extends IBase {
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
