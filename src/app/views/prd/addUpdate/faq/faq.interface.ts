import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IFaq extends IBase {
  ProductID: number;
  product: string;
  Question: string;
  Answer: string;
  ID: number;
}
