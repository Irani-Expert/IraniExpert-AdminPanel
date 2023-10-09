import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { PlanModel } from './plan.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class PlanService extends BaseService<PlanModel, 0> {
  userGuid = environment.jwtToken;
  plans$ = new BehaviorSubject<Array<PlanModel>>(new Array<PlanModel>());
  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }
  get plansOfProductId() {
    return this.plans$.value;
  }
  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getPlanByProductId(productId: number): Observable<Result<PlanModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<PlanModel[]>>(
      this._base + '/Plan/GetByProductId/' + productId,
      _options
    );
  }
}
