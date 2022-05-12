import { Base } from "src/app/shared/models/Base/base.model";
import { IBackTest } from "./back-test.interface";


export class BackTestModel extends Base implements IBackTest {
  productId: number;
  product: string;
  videoUrl: string;
  fileUrl: string;
cardImagePath: string;
}
