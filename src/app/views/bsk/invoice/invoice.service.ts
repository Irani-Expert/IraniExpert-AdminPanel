import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { InvoiceModel } from './invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends BaseService<InvoiceModel, 0> {
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
    orderId: number,
    tableType: number
  ): Observable<Result<InvoiceModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<InvoiceModel[]>>(
      this._base +
        '/invoice/GetByTableTypeAndRowId/' +
        orderId +
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
        '&orderId=' +
        orderId +
        '&tableType=' +
        tableType,
      _options
    );
  }
}
