import { Base } from 'src/app/shared/models/Base/base.model';
import { IProduct } from './product.interface';
import { TableType } from '../../Log/models/table-typeModel';

export class ProductModel extends Base implements IProduct {
  cardImagePath: string;
  iconPath: number;
  type: number;
  id: number;
  title: string;
  fileExists: boolean;
  browserTitle : string;
  colorCode: string;
  isRTL: boolean;
  secondTitle: string;
  authorizeAccepted: boolean;
  managementAccepted: boolean;
  seoAccepted: boolean;
  metaDescription: string;
  brief: string;
  linkTags?:TableType[];
  discountPrice?: number;
  price?: number;
}
