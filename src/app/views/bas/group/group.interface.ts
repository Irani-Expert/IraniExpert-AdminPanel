import { IBase } from "src/app/shared/interfaces/Base/base.interface";

export interface IGroup extends IBase{
  parentID:number;
  parentGroupTitle:string;
  type:number;
  iconKey:string;
  cardImagePath:string;
}
