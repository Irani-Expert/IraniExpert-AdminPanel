import { Base } from 'src/app/shared/models/Base/base.model';
import { IProduct } from './product.interface';

export class ProductModel extends Base implements IProduct {
  cardImagePath: string;
  iconPath: number;
  type: number;
  id: number;
  title: string;
  fileExists: boolean;
  browserTitle : string;

}
