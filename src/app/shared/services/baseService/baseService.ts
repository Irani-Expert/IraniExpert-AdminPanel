import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IBaseService } from './baseService.interface';
import { catchError, delay } from 'rxjs/operators';
import { Result } from '../../models/Base/result.model';
import { Filter } from '../../models/Base/filter.model';
import { environment } from 'src/environments/environment.prod';
import { Paginate } from '../../models/Base/paginate.model';

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
  constructor(protected _http: HttpClient, protected _base: string) {}

  /**
   *  درخواست ایجاد
   * @param t
   * @param route
   * @returns insert
   */
  create(t: object, route: string): Observable<Result<number>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.post<Result<number>>(this._base + '/' + route, t, _options);
  }

  /**
   * درخواست  آپدیت
   * @param id
   * @param t
   * @param route
   * @returns update
   */
  update(id: number, t: T, route: string): Observable<Result<T>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.put<Result<T>>(
      this._base + '/' + route + '/' + id,
      t,
      _options
    );
  }

  /**
   * درخواست دریافت یک رکورد بر اساس آیدی
   * @param t
   * @param route
   * @returns one by id
   */
  getOneByID(id: number, route: string): Observable<Result<T>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<T>>(
      this._base + '/' + route + '/' + id,
      _options
    );
  }

  /**
   * درخواست دریافت یک رکورد بر اساس آیدی
   * @param filter
   * @param route
   * @returns one by id
   */
  getTitleValues(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    route: string
  ): Observable<Result<Paginate<T[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<T[]>>>(
      this._base +
        '/' +
        route +
        '/GetTitleValues?pagIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        '&filter=' +
        filter,
      _options
    );
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  get(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    route: string
  ): Observable<Result<Paginate<T[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<T[]>>>(
      this._base +
        '/' +
        route +
        '?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        '&filter=' +
        filter,
      _options
    );
  }

  /**
   * درخواست حذف
   * @param id
   * @param route
   * @returns by id
   */
  delete(id: number, route: string): Observable<Result<T>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.delete<Result<T>>(
      this._base + '/' + route + '/' + id,
      _options
    );
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = `error in ${operation}()`;
      console.error(error); // log to console instead
      return throwError(errMsg);
    };
  }
}
