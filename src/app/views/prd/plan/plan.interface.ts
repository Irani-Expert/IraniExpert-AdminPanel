


import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IPlan extends IBase{
  productID:number;
  product:string;
  price:number;
  expireDate:Date;
  iconPath:string;
}











