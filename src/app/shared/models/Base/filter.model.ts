import { IFilter } from "../../interfaces/Base/filter.interface";

export class Filter<T> implements IFilter{
  pageIndex:number;
  pageSize:number;
  pageOrder:string;
  filters:string;
  t:T;
}
