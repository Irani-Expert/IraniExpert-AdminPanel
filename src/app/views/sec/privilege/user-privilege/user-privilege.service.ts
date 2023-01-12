import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { PrivilegeModel } from '../privilege.model';
import { AddUpdateprivilage } from './add-updateprivilage.model';
import { UserPrivilegeModel } from './user-privilege.model';

@Injectable({
  providedIn: 'root',
})
export class UserPrivilegeService extends BaseService<UserPrivilegeModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }

  addUpdateUserPrivilege(Updateprivilege:AddUpdateprivilage[]){
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    debugger
    return this._http.post<Result<number>>(
      this._base +
        '/UserPrivilege/AddUpdateUserPrivilege'
     ,Updateprivilege
     , _options
    );
    
  }
  }

