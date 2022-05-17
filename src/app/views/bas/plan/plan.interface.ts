


import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IPlan extends IBase{
  productId:number;
  product:string;
  price:number;
  expireDate:Date;
  iconPath:string;
}











