import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { FaqModel } from './faq.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class FaqService extends BaseService<FaqModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getFaqByProductId(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    productId: number,
    tableType: number
  ): Observable<Result<FaqModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<FaqModel[]>>(
      this._base +
        '/Faq/GetByTableTypeAndRowID/' +
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
        '&tabletype=' +
        tableType,
      _options
    );
  }
}
