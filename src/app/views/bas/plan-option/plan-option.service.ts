import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { PlanOptionModel } from './plan-option.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class PlanOptionService extends BaseService<PlanOptionModel, 0> {
  userGuid = environment.jwtToken;
  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }
  /**
   * @param route
   * @return all
   */
  getPlanOptionByPlanId(
    planId: number
  ): Observable<Result<Paginate<PlanOptionModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<PlanOptionModel[]>>>(
      this._base + '/PlanOption/GetByPlanID/' + planId,
      _options
    );
  }
}
