import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IBaseService } from './baseService.interface';
import { catchError, delay } from "rxjs/operators";
import { Result } from '../../models/Base/result.model';
import { Filter } from '../../models/Base/filter.model';

/**
 * سرویس پایه
 * @template T
 * @template ID
 */
export abstract class BaseService<T, ID> implements IBaseService<T, ID> {



  /**
   * نمونه ای از سرویس پایه .
   * @param _http
   * @param _base
   * @param _options
   */
  constructor(
    protected _http: HttpClient,
    protected _base: string,
    protected _options: {}
  ) {

  }


  /**
   *  درخواست ایجاد
   * @param t
   * @param route
   * @returns insert
   */
  insert(t: object, route: string): Observable<Result<T>> {
    return this._http.post<Result<T>>(this._base + "/" + route, t, this._options);
  }


  /**
   * درخواست  آپدیت
   * @param id
   * @param t
   * @param route
   * @returns update
   */
  update(id: number, t: T, route: string): Observable<Result<T>> {
    return this._http.put<Result<T>>(this._base + "/" + route+"/"+id, t, this._options);
  }

  /**
   * درخواست دریافت یک رکورد بر اساس آیدی
   * @param t
   * @param route
   * @returns one by id
   */
  getOneByID( route: string): Observable<Result<T>> {
    return this._http.get<Result<T>>(this._base + "/" + route, this._options);
  }

  /**
   * درخواست دریافت یک رکورد بر اساس آیدی
   * @param filter
   * @param route
   * @returns one by id
   */
  getTitleValues(route: string): Observable<Result<T[]>> {
    return this._http.get<Result<T[]>>(this._base + "/" + route +"/GetTitleValues", this._options);
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getAll(route: string): Observable<Result<T[]>> {


    return this._http.get<Result<T[]>>(this._base + "/" + route, this._options)


  }


  /**
   * درخواست حذف
   * @param id
   * @param route
   * @returns by id
   */
  deleteByID(id: number, route: string): Observable<Result<T>> {
    return this._http.delete<Result<T>>(this._base + "/" + route+"/"+id, this._options);
  }



  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = `error in ${operation}()`;
      console.error(error); // log to console instead
      return throwError(errMsg);
    };
  }

}
