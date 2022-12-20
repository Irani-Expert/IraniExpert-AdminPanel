import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { CommentModel } from '../../../shared/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService extends BaseService<CommentModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
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
        Authorization: 'bearer ' + environment.jwtToken,
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
      pageSize: number,
    ): Observable<Result<Paginate<CommentModel[]>>> {
      let _options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + environment.jwtToken,
        }),
      };
      return this._http.get<Result<Paginate<CommentModel[]>>>(
        this._base +
          '/Comment/GetByTableTypeAndRowIdAndUserId' +
          '?pagIndex=' +
          pageIndex +
          '&pageSize=' +
          pageSize,
        _options
      );
    }
    GetAllComment(
      pageIndex: number,
      pageSize: number,
     
    ): Observable<Result<Paginate<CommentModel[]>>> {
      let _options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + environment.jwtToken,
        }),
      };
      return this._http.get<Result<Paginate<CommentModel[]>>>(
        this._base +
          '/Comment' +
          '?pagIndex=' +
          pageIndex +
          '&pageSize=' +
          pageSize,
        _options
      );
    }
}
