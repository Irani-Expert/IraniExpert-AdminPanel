import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { PlanOptionModel } from './plan-option.model';

@Injectable({
  providedIn: 'root'
})
export class PlanOptionService extends BaseService<PlanOptionModel, 0> {
  userGuid = environment.jwtToken;
  constructor(public _http : HttpClient) {

    super(_http, environment.api.baseUrl);
  }
  /** 
 * @param route
 * @return all
*/
  getPlanOptionByPlanId(pageIndex: number, pageSize: number, pageOrder:string, filter: string, planId: number) : Observable<Result<PlanOptionModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer '+environment.jwtToken
      }),
    };
    return this._http.get<Result<PlanOptionModel[]>>(this._base + "/Plan/GetByProductId/" + planId +
    "?pagIndex="+pageIndex+
    "&pageSize="+pageSize+
    "&pageOrder="+pageOrder+
    "&filter="+filter+
    "&productId="+planId,
    _options);
  }
}
