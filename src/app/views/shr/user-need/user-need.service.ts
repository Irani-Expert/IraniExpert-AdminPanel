import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { UserNeedModel } from './user-need.model';

@Injectable({
  providedIn: 'root',
})
export class UserNeedService extends BaseService<UserNeedModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  GetByTableTypeAndRowId(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    productId: number,
    tableType: number
  ): Observable<Result<UserNeedModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<UserNeedModel[]>>(
      this._base +
        '/UserNeed/GetByTableTypeAndRowId/' +
        productId +
        '/' +
        tableType +
        '?pagIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        '&filter=' +
        filter +
        '&productId=' +
        productId +
        '&tableType=' +
        tableType,
      _options
    );
  }
}
