import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';

import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { UserCountModel } from '../../dashboard/dashboad-default/userInfo.model';
import { UpdatePasswordModel } from '../../dashboard/user-profile/UpdatePassword.model';
import { UsersModel } from './users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<UsersModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  /**
   * درخواست  آپدیت
   * @param id
   * @param t
   * @param route
   * @returns update
   */
   changePassword( t: UpdatePasswordModel): Observable<Result<boolean>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.put<Result<boolean>>(
      environment.api.baseUrl + '/AspNetUser/ChangePassword' ,
      t,
      _options
    );
  }
   /**
   * درخواست  آپدیت
   * @param id
   * @param t
   * @param route
   * @returns update
   */
    updateUser(id:number, t: UserInforamationModel): Observable<Result<boolean>> {
      let _options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + environment.jwtToken,
        }),
      };
      return this._http.put<Result<boolean>>(
        environment.api.baseUrl + '/AspNetUser/UpdateUser/'+id ,
        t,
        _options
      );

    }

      /**
   * درخواست دریافت یک رکورد بر اساس آیدی
   * @param t
   * @param route
   * @returns one by id
   */
  getUserByToken(): Observable<UserInforamationModel> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<UserInforamationModel>(
      environment.api.baseUrl + '/AspNetUser/GetUserByToken' ,
      _options
    );
  }


  getUserInfo(): Observable<Result<UserCountModel>> {
          let _options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'bearer ' + environment.jwtToken,
            }),
          };
          return this._http.get<Result<UserCountModel>>(
            environment.api.baseUrl + '/AspNetUser/UserProfile' ,
            _options
          );
        }

}
