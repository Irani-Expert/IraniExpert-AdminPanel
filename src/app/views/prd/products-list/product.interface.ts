import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IProduct extends IBase {
  cardImagePath: string;
  iconPath: number;
  type: number;
  id: number;
  title: string;
  fileExists: boolean;
  browserTitle : string;
  discountPrice?: number;
  price?: number;
}
