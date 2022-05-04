import { environment } from '../../../../environments/environment.prod';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from '../baseService/baseService';
import { BannerModel } from '../../models/cnt/banner.model';

@Injectable()
export class BannerService extends BaseService<BannerModel, 0> {
  // public static BASE_API_URL = 'http://192.168.2.171:2233/api';
  userGuid = environment.userGuid;
    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(public _http: HttpClient) {

    super(_http, environment.api.baseUrl, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  });
  }


  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = `error in ${operation}()`;
      console.error(error); // log to console instead
      return throwError(errMsg);
    };
  }
}
