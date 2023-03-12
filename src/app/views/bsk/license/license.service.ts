import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { OrderModel } from '../order/order.model';
import { CliamxLicenseModel, CliamxResponse } from './cliamaxLicense.model';
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
        // Authorization: 'bearer ' + environment.jwtToken,
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
    _versionNumber: number = 1
  ): Observable<Result<Paginate<OrderModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<OrderModel[]>>>(
      this._base +
        '/Orders/GetLicenses' +
        '?pageIndex=' +
        _pageIndex +
        '&pageSize=' +
        _pageSize +
        '&versionNumber=' +
        _versionNumber,
      _options
    );
  }

  sendLicenseToClimax(climaxLicenseModel: CliamxLicenseModel) {
    var model = {
      apiKey: 'fkwm@kdo23&#nd@dc$fmvJMkI2Ewu4R',
      accountNumber: climaxLicenseModel.accountNumber,
      activationDate: new Date(climaxLicenseModel.startDate).getTime() / 1000,
      expireDate: new Date(climaxLicenseModel.expireDate).getTime() / 1000,
      licenseNumber: climaxLicenseModel.licenseId.toString(),
    };

    var fd = new FormData();
    fd.append('files.licenseFile', climaxLicenseModel.file);
    fd.append('data', JSON.stringify(model));
    return this._http.put<CliamxResponse>(
      'https://api-main.climaxprime.tools/users-promotions',
      fd,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers':
            'origin,X-Requested-With,content-type,accept',
          'Access-Control-Allow-Credentials': 'true',
        }),
      }
    );
  }
}
