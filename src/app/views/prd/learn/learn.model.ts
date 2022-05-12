import { Base } from "src/app/shared/models/Base/base.model";
import { ILeran } from "./learn.interface";


export class LearnModel extends Base implements ILeran {
  productID: number;
  product: string;
  videoUrl: string;
  fileUrl: string;
  tableType: string;
  rowID: number;
}
