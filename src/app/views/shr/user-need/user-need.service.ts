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
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  public sidebarState: INoteSidebar = {
    sidenavOpen: true,
  };
  getByStatus(pageSize: number, pageIndex: number, userWant: number) {
    return this._http.get<Result<Paginate<UserNeedModel[]>>>(
      this._base +
        '/UserNeed/GetByUserWant?pageIndex=' +
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

  getUserNeed(filter: FilterModel) {
    return this._http.get<Result<Paginate<UserNeedModel[]>>>(
      this._base +
        '/UserNeed?' +
        (filter.firstName ? 'FirstName=' + filter.firstName : ''),
      this._options
    );
  }
}
