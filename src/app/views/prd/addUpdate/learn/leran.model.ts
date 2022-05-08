import { Base } from "src/app/shared/models/Base/base.model";
import { ILeran } from "./leran.interface";


export class LeranModel extends Base implements ILeran {
  ProductID: number;
  product: string;
  VideoUrl: string;
  FileUrl: string;
  TableType: string;
  ID: number;



}
