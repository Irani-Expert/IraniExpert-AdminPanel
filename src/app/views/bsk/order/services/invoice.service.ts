import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { InvoiceModel } from '../models/invoice.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends BaseService<InvoiceModel, 0> {
  userGuid = environment.jwtToken;
  invoiceItemSubject = new BehaviorSubject(new InvoiceModel());
  get invoiceValue() {
    return this.invoiceItemSubject.value;
  }
  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
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
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
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
  getInvoice(orderID: number) {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<InvoiceModel[]>>(
      `${this._base + '/Invoice/GetByTableTypeAndRowId/' + orderID + '/8'}`,
      _options
    );
  }
}
