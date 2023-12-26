import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IFaq extends IBase {
  tableType: number;
  rowId: number;
  question: string;
  answer: string;
  id: number;
}
