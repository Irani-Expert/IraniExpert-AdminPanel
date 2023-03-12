import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserBaseInfoModel } from 'src/app/shared/models/userBaseInfoModel';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ContractModel } from './contract-list/contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService extends BaseService<ContractModel, number> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  getUserInfiById(
    id: number,
    route: string
  ): Observable<Result<UserBaseInfoModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<UserBaseInfoModel[]>>(
      this._base + '/' + route + '?roleID=' + id,

      _options
    );
  }
}
