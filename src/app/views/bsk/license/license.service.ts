import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { OrderModel } from '../order/order.model';
import { LicenseModel } from './license.model';

@Injectable({
  providedIn: 'root',
})
export class LicenseService extends BaseService<LicenseModel, 0> {
  userGuid = environment.jwtToken;
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  getOrdersIsPaid(
    _pageIndex: number,
    _pageSize: number
  ): Observable<Result<Paginate<OrderModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<OrderModel[]>>>(
      this._base +
        '/Orders/GetOrdersIsPaid' +
        '?pageIndex=' +
        _pageIndex +
        '&pageSize=' +
        _pageSize,
      _options
    );
  }

  getLicenses(
    _pageIndex: number,
    _pageSize: number,
    _versionNumber:number=1
  ): Observable<Result<Paginate<OrderModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<OrderModel[]>>>(
      this._base +
        '/Orders/GetLicenses' +
        '?pageIndex=' +
        _pageIndex +
        '&pageSize=' +
        _pageSize+
        '&versionNumber='+
        _versionNumber,
      _options
    );
  }
}
