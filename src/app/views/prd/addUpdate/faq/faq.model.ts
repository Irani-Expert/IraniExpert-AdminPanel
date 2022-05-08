import { Base } from "src/app/shared/models/Base/base.model";
import { IFaq } from "./faq.interface";


export class FaqModel extends Base implements IFaq {
  ProductID: number;
  product: string;
  Question: string;
  Answer: string;
  ID: number;

}
