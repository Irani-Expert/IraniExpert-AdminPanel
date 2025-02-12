import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';
import { UserRolesModel } from 'src/app/shared/models/userRoles';

import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { UserCountModel } from '../../dashboard/dashboad-default/userInfo.model';
import { UsersModel } from './users.model';
import { UpdatePasswordModel } from '../../dashboard/user-profile/updatePassword.model';

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
  changePassword(t: UpdatePasswordModel): Observable<Result<boolean>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.put<Result<boolean>>(
      environment.api.baseUrl + '/AspNetUser/ChangePassword',
      // +
      // '?authorID=' +
      // this.auth.currentUserValue.userID,
      t,
      _options
    );
  }
  getUserByRoleID(
    pageIndex: number,
    pageSize: number,
    roleID: number
  ): Observable<Result<Paginate<UsersModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        // Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<UsersModel[]>>>(
      environment.api.baseUrl +
        '/AspNetUser/GetUsersByRoleID?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&roleID=' +
        roleID,

      _options
    );
  }
  updateUserRole(
    roles: UserRolesModel[]
  ): Observable<Result<UserRolesModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        // Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.post<Result<UserRolesModel[]>>(
      environment.api.baseUrl + '/AspNetUserRole/AddUpdateUserRoles',
      roles,
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
  updateUser(
    id: number,
    t: UserInforamationModel
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
    return this._http.put<Result<boolean>>(
      environment.api.baseUrl + '/AspNetUser/UpdateUser/' + id,
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
  getUserByToken(): Observable<Result<UserInforamationModel>> {
    let token = localStorage.getItem('token');
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http
      .post<Result<UserInforamationModel>>(
        // `${environment.api.baseUrl}/auth/check-user-permission?token=${token}`,
        `${environment.api.baseUrl}/auth/check-user-permission-new`,
        undefined,
        _options
      )
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  getUserInfo(): Observable<Result<UserCountModel>> {
    let token = localStorage.getItem('token');
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };

    return this._http.get<Result<UserCountModel>>(
      environment.api.baseUrl + '/AspNetUser/UserProfile?token=' + token,
      _options
    );
  }
  changeParentPresentor(
    userId: number,
    newParentToChange: string
  ): Observable<Result<number>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.post<Result<number>>(
      environment.api.baseUrl +
        '/Relation/ChangeParentPresentor?userId=' +
        userId +
        '&newReferralCode=' +
        newParentToChange,
      _options
    );
  }
  getUserByFilter(
    pageIndex: number,
    pageSize: number,
    filterData: UsersModel,
    ref: number,
    roleID: number
  ): Observable<Result<Paginate<UsersModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        // Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<UsersModel[]>>>(
      environment.api.baseUrl +
        '/AspNetUser/?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        (filterData.id == undefined || filterData.id == null
          ? ''
          : '&Id=' + filterData.id) +
        (filterData.userName == undefined || filterData.userName == null
          ? ''
          : '&UserName=' + filterData.userName) +
        (filterData.email == undefined || filterData.email == null
          ? ''
          : '&Email=' + filterData.email) +
        (filterData.phoneNumber == undefined || filterData.phoneNumber == null
          ? ''
          : '&PhoneNumber=' + filterData.phoneNumber) +
        (filterData.accountNumber == undefined ||
        filterData.accountNumber == null
          ? ''
          : '&AccountNumber=' + filterData.accountNumber) +
        (filterData.firstName == undefined || filterData.firstName == null
          ? ''
          : '&FirstName=' + filterData.firstName) +
        (filterData.lastName == undefined || filterData.lastName == null
          ? ''
          : '&LastName=' + filterData.lastName) +
        (roleID == undefined || roleID == null ? '' : '&RoleId=' + roleID) +
        (filterData.referralCode == undefined || filterData.referralCode == null
          ? ''
          : '&ReferralCode=' + filterData.referralCode) +
        (filterData.isActive == undefined || filterData.isActive == null
          ? ''
          : '&IsActive=' + filterData.isActive) +
        (filterData.fromSignUpDate == undefined ||
        filterData.fromSignUpDate == null
          ? ''
          : '&FromSignUpDate=' + filterData.fromSignUpDate) +
        (filterData.ToSignUpDate == undefined || filterData.ToSignUpDate == null
          ? ''
          : '&ToSignUpDate=' + filterData.ToSignUpDate),
      _options
    );
  }
}
