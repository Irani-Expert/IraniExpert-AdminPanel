import { UserMenuModel } from './../models/userMenu.model';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
// import {} from 'rxjs/';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private _http: HttpClient) {}

  public static BASE_API_URL = 'http://192.168.2.171/GlobalApi/api';
  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };

  public getUserPermission(
    guid: string,
    orgId: number = null
  ): Observable<UserMenuModel> {
    var url = GlobalService.BASE_API_URL + '/Athenticate/getUserPermissions';
    type WindowStates = 'open' | 'closed' | 'minimized';
    if (orgId !== 0) {
      return this._http
        .post<UserMenuModel>(
          url,
          { Guid: guid, SubSystemId: 20, OrganizationId: orgId },
          GlobalService.httpOptions
        )
        .pipe(catchError(this.handleError<UserMenuModel>('login')));
    } else {
      return this._http
        .post<UserMenuModel>(
          url,
          { Guid: guid, SubSystemId: 20 },
          GlobalService.httpOptions
        )
        .pipe(catchError(this.handleError<UserMenuModel>('login')));
    }
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = `error in ${operation}()`;
      console.error(error); // log to console instead
      return throwError(errMsg);
    };
  }
}
