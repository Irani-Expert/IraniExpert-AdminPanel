import { Observable } from 'rxjs';
import { Paginate } from '../../models/Base/paginate.model';
import { Result } from '../../models/Base/result.model';

/**
 * اینرفیس سرویس پایه
 * @template T
 */
export interface IBaseService<T, ID> {
  create(t: object, route: string): Observable<Result<number>>;
  update(id: number, t: T, route: string): Observable<Result<T>>;
  getOneByID(id: number, route: string): Observable<Result<T>>;
  getTitleValues(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    route: string
  ): Observable<Result<Paginate<T[]>>>;
  get(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    route: string
  ): Observable<Result<Paginate<T[]>>>;
  delete(id: number, route: string): Observable<Result<T>>;
  getByTableTypeandRowId(
    pageIndex: number,
    pageSize: number,
    filter: string,
    rowID: number,
    tableType: number,
    route: string
  );
}
