import { Base } from "src/app/shared/models/Base/base.model";
import { IFacility } from "./facility.interface";


export class FacilityModel extends Base implements IFacility {
    productId : number;
    product : string;

}