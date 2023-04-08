import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { Result } from 'src/app/shared/models/Base/result.model';
import { referralModel } from 'src/app/shared/models/referralModel';
import { UserReferralModel } from 'src/app/shared/models/userReferralModel.model';

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

  postUserReferral(data: UserReferralModel) {
    return this._http.post<UserReferralModel>(
      this._base + '/UserNeed',
      data,
      this._options
    );
  }
}
// =1148
