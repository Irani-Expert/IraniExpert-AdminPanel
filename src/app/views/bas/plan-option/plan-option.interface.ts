import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IPlanOption extends IBase{
  planID: number;
  plan: string;
  price: number;
  iconPath: string;
}