
import { Observable } from 'rxjs';
import { Filter } from '../../models/Base/filter.model';
import { Result } from '../../models/Base/result.model';


/**
 * اینرفیس سرویس پایه
 * @template T
 */
export interface IBaseService<T, ID> {
	insert(t: object, route: string): Observable<Result<T>>;
	update(id: number, t: T, route: string): Observable<Result<T>>;
	getOneByID( route: string): Observable<Result<T>>;
  getTitleValues(route: string): Observable<Result<T[]>>;
	getAll(route: string): Observable<Result<T[]>>;
	deleteByID(id: number,route: string): Observable<Result<T>>;

}
