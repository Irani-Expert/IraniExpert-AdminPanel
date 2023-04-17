import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { UserNeedModel } from './user-need.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
interface INoteSidebar {
  sidenavOpen?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UserNeedService extends BaseService<UserNeedModel, 0> {
  userGuid = environment.jwtToken;
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
  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }
  public sidebarState: INoteSidebar = {
    sidenavOpen: true,
  };

  getByStatus(pageSize: number, pageIndex: number, userWant: number) {
    return this._http.get<Result<Paginate<UserNeedModel[]>>>(
      this._base +
        '/UserNeed?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&userWant=' +
        userWant,
      this._options
    );
  }

  getCommentByRowid(rowID: number) {
    return this._http.get<Result<Paginate<CommentModel[]>>>(
      this._base +
        '/Comment/GetByTableTypeAndRowId/' +
        rowID +
        '/10?pageIndex=0&pageSize=100',
      this._options
    );
  }

  getUserNeed(
    filter: FilterModel,
    pageIndex: number,
    pageSize: number,
    userWant: number
  ) {
    return this._http.get<Result<Paginate<UserNeedModel[]>>>(
      this._base +
        '/UserNeed?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        (filter.iD ? '&ID=' + filter.iD : '') +
        (filter.firstName ? '&FirstName=' + filter.firstName : '') +
        (filter.lastName ? '&LastName=' + filter.lastName : '') +
        (filter.phoneNumber ? '&PhoneNumber=' + filter.phoneNumber : '') +
        (filter.email ? '&Email=' + filter.phoneNumber : '') +
        (userWant !== undefined ? '&UserWant=' + userWant : '') +
        (filter.amount ? '&Amount=' + filter.amount : '') +
        (filter.financialActivity
          ? '&FinancialActivity=' + filter.financialActivity
          : '') +
        (filter.robotUsage ? '&RobotUsage=' + filter.robotUsage : '') +
        (filter.fromCreateDate
          ? '&FromCreateDate=' + filter.fromCreateDate
          : '') +
        (filter.toCreateDate ? '&ToCreateDate=' + filter.toCreateDate : ''),

      this._options
    );
  }
}
