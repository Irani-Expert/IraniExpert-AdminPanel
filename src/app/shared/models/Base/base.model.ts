import { IBase } from '../../interfaces/Base/base.interface';

export class Base implements IBase {
  title:string;
  id:number;
  description:string;
  orderID:number;
  isActive:boolean;
  colorCode: string;
  isRTL: boolean;
  secondTitle: string;
  authorizeAccepted: boolean;
  managementAccepted: boolean;
  seoAccepted: boolean;
  metaDescription: string;
  browserTitle: string;
  brief: string;
}
