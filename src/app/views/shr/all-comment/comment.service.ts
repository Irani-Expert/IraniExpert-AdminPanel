import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { CommentModel } from '../../../shared/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService extends BaseService<CommentModel, 0> {
  userGuid = environment.jwtToken;
  userId: number;

  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  GetByTableTypeAndRowId(
    pageIndex: number,
    pageSize: number,
    productId: number,
    tableType: number
  ): Observable<Result<Paginate<CommentModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<CommentModel[]>>>(
      this._base +
        '/Comment/GetByTableTypeAndRowId/' +
        productId +
        '/' +
        tableType +
        '?pagIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize,
      _options
    );
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  GetByTableTypeAndRowIdAndUserId(
    pageIndex: number,
    pageSize: number
  ): Observable<Result<Paginate<CommentModel[]>>> {
    this.userId = this._auth.currentUserValue.userID;
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<CommentModel[]>>>(
      this._base +
        '/Comment/GetByTableTypeAndRowIdAndUserId' +
        '?pagIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&userID=' +
        this.userId,
      _options
    );
  }
  GetAllComment(
    pageIndex: number,
    pageSize: number,
    tableType: number,
    filter: FilterModel
  ): Observable<Result<Paginate<CommentModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<CommentModel[]>>>(
      this._base +
        '/Comment?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&TableType=' +
        tableType +
        (filter.iD == undefined || filter.iD == null
          ? ''
          : '&ID=' + filter.iD) +
        (filter.userID == undefined || filter.userID == null
          ? ''
          : '&UserID=' + filter.userID) +
        (filter.parentID == undefined || filter.parentID == null
          ? ''
          : '&ParentID=' + filter.parentID) +
        (filter.rowID == undefined || filter.rowID == null
          ? ''
          : '&RowID=' + filter.rowID) +
        (filter.name == undefined || filter.name == null
          ? ''
          : '&Name=' + filter.name) +
        (filter.email == undefined || filter.email == null
          ? ''
          : '&Email=' + filter.email) +
        (filter.rate == undefined || filter.rate == null
          ? ''
          : '&Rate=' + filter.rate) +
        (filter.isAccepted == undefined || filter.isAccepted == null
          ? ''
          : '&IsAccepted=' + filter.isAccepted) +
        (filter.fromCreateDate == undefined || filter.fromCreateDate == null
          ? ''
          : '&FromCreateDate=' + filter.fromCreateDate) +
        (filter.toCreateDate == undefined || filter.toCreateDate == null
          ? ''
          : '&ToCreateDate=' + filter.toCreateDate),
      _options
    );
  }
}
