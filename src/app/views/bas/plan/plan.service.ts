import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { PlanModel } from './plan.model';

@Injectable({
  providedIn: 'root',
})
export class PlanService extends BaseService<PlanModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getPlanByProductId(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string,
    productId: number
  ): Observable<Result<Paginate<PlanModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<PlanModel[]>>>(
      this._base +
        '/Plan/GetByProductId/' +
        productId +
        '?pagIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        '&filter=' +
        filter +
        '&productId=' +
        productId,
      _options
    );
  }
}
