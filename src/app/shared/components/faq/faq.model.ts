import { Base } from 'src/app/shared/models/Base/base.model';
import { IFaq } from './faq.interface';

export class FaqModel extends Base implements IFaq {
  tableType: number;
  rowId: number;
  question: string;
  answer: string;
  id: number = 0;
}
