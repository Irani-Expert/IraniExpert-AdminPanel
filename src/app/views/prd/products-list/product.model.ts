import { Base } from 'src/app/shared/models/Base/base.model';
import { IProduct } from './product.interface';

export class ProductModel extends Base implements IProduct {
  cardImagePath:string;
  iconPath:number;
  type:string;
  commentCount:number;
}
