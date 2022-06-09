import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface ILearn extends IBase {
  productId: number;
  product: string;
  videoUrl: string;
  fileUrl: string;
  tableType: number;
  rowID: number;
}
