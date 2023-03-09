import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { SecModule } from '../sec.module';
import { UserRoleModel } from './user-role.model';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService extends BaseService<UserRoleModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  deleteIt(
    userId: number,
    roleId: number,
    route: string
  ): Observable<Result<UserRoleModel>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.delete<Result<UserRoleModel>>(
      this._base + '/' + route + '/' + userId + ',' + roleId,
      _options
    );
  }
}
