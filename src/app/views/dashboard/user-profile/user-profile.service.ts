import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { Result } from 'src/app/shared/models/Base/result.model';
import { referralModel } from 'src/app/shared/models/referralModel';
import { UserReferralModel } from 'src/app/shared/models/userReferralModel.model';
import { Observable } from 'rxjs';
import { UsersModel } from '../../sec/user-mangement/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
      // Authorization: 'bearer ' + environment.jwtToken,
    }),
  };

  protected _base: string = environment.api.baseUrl;
  constructor(public _http: HttpClient) {}

  getParentLevelOne(userId: number) {
    return this._http.get<Result<referralModel>>(
      this._base + '/Relation/GetParentLevelOne?userId=' + userId,
      this._options
    );
  }

  postUserReferral(
    data: UserReferralModel
  ): Observable<Result<UserReferralModel>> {
    return this._http.post<Result<UserReferralModel>>(
      this._base + '/UserNeed',
      data,
      this._options
    );
  }
  updateUserbyAspnet(
    id: number,
    t: UsersModel
  ): Observable<Result<boolean>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    debugger
    return this._http.put<Result<boolean>>(
      environment.api.baseUrl + '/AspNetUser/' + id+'?authorID='+2217,
      t,
      _options
    );
  }
}
// =1148
