import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDataModel } from './NodeModel/UserData.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SubUserService extends BaseService<UserDataModel, number> {
  userGuid = environment.jwtToken;
  userID: number;

  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }
  GetChildsLevelOne(userID: number): Observable<Result<UserDataModel[]>> {
    this.userID = this._auth.currentUserValue.userID;
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<UserDataModel[]>>(
      this._base + '/Relation/GetChildsLevelOne/' + '?userId=' + userID,
      _options
    );
  }
}
