import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { CommissionModel } from './commission.model';

@Injectable({
  providedIn: 'root',
})
export class CommissionService extends BaseService<CommissionModel, 0> {
  userID: number;

  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }

  getMyCommission(
    userID: number,
    sellingType: number
  ): Observable<Result<CommissionModel>> {
    // this.userID = this._auth.currentUserValue.userID;
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<CommissionModel>>(
      this._base +
        '/Orders/GetCommissionByUserIDAndSellingType' +
        '?userID=' +
        userID +
        '&sellingType=' +
        sellingType,
      _options
    );
  }
}
