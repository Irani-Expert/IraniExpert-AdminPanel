import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { BackTestModel } from './back-test.model';

@Injectable({
  providedIn: 'root'
})
export class BackTestService  extends BaseService<BackTestModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {

    super(_http, environment.api.baseUrl);
   }

    /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
     getBackTestByProductId(pageIndex: number, pageSize: number, pageOrder: string, filter: string, productId: number): Observable<Result<BackTestModel[]>> {
      let _options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'bearer '+environment.jwtToken
        }),
      };
      return this._http.get<Result<BackTestModel[]>>(this._base + "/BackTest/GetBackTestByProductId/" + productId +
      "?pagIndex="+pageIndex+
      "&pageSize="+pageSize+
      "&pageOrder="+pageOrder+
      "&filter="+filter+
      "&productId="+productId,
      _options);
    }
}



