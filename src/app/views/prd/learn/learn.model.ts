import { Base } from "src/app/shared/models/Base/base.model";
import { ILearn } from "./learn.interface";


export class LearnModel extends Base implements ILearn {
  productID: number;
  product: string;
  videoUrl: string;
  fileUrl: string;
  tableType: string;
  rowID: number;
}
