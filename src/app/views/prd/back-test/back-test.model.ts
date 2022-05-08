import { Base } from "src/app/shared/models/Base/base.model";
import { IBackTest } from "./back-test.interface";


export class BackTestModel extends Base implements IBackTest {
  ProductID: number;
  product: string;
  VideoUrl: string;
  FileUrl: string;
  TableType: string;
  RowID: number;
  UpdateDate: Date;
  UpdateBy: string;
  CreateDate: Date;
  CreateBy: string;
  title: string;
  id: number;
  description: string;
  orderID: number;
  isActive: boolean;


}
