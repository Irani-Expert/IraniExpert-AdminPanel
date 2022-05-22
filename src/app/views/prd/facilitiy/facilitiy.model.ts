import { Base } from "src/app/shared/models/Base/base.model";
import { IFacilitiy } from "./facilitiy.interface";


export class FacilitiyModel extends Base implements IFacilitiy {
    productId : number;
    product : string;

}