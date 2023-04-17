import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserBaseInfoModel } from 'src/app/shared/models/userBaseInfoModel';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ContractModel } from './contract-list/contract.model';
import { ConditionModel } from 'src/app/shared/models/ConditionModel';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class conditionService extends BaseService<ConditionModel, number> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }
}
