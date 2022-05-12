import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IBackTest extends IBase{
  productId: number;
  product: string;
  videoUrl: string;
  fileUrl: string;
cardImagePath: string;
}

