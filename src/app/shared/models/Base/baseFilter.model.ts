import { IBase } from '../../interfaces/Base/base.interface';

export abstract class BaseFilterModel<T>  {
  constructor() {
    this.pageno = 0;
    this.seednumber = 10;
    this.filterBody = null;
  }
  pageno: number;
  seednumber: number;
  filterBody?: T;
}
