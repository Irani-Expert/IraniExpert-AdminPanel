import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { ProductModel } from './product.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { tagModel } from '../../cnt/tags/tagModel/tag.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { tagRelationModel } from '../../cnt/article/tagModel/tagRelation.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<ProductModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }

  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };

  getOneByID(
    productId: number,
    route: string
  ): Observable<Result<ProductModel>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<ProductModel>>(
      this._base + '/' + route + '/' + productId,

      _options
    );
  }

  // getTags() {
  //   return this._http.get<Result<Paginate<tagModel[]>>>(
  //     this._base + '/LinkTag?pageIndex=0',
  //     this._options
  //   );
  // }
  getTags(
    filter: FilterModel,
    pageIndex: number,
    pageSize: number,
    pageOrder: string = 'ID'
  ) {
    return this._http.get<Result<Paginate<tagModel[]>>>(
      this._base +
        '/LinkTag?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        (filter.iD ? '&ID=' + filter.iD : '') +
        (filter.title ? '&Title=' + filter.title : '') +
        (filter.groupID ? '&GroupID=' + filter.groupID : '') +
        (filter.rowID ? '&RowID=' + filter.rowID : '') +
        (filter.TableType ? '&TableType=' + filter.TableType : '') +
        (filter.fromCreateDate !== undefined
          ? '&FromCreateDate=' + filter.fromCreateDate
          : '') +
        (filter.toCreateDate ? '&ToCreateDate=' + filter.toCreateDate : '') +
        (filter.fromUpdateDate
          ? '&FromUpdateDate=' + filter.fromUpdateDate
          : '') +
        (filter.toUpdateDate ? '&ToUpdateDate=' + filter.toUpdateDate : ''),

      this._options
    );
  }
  addTagToArticle(tagRelation: tagRelationModel[]) {
    let loggedUserID = this.auth.currentUserValue.userID;
    return this._http.post<Result<tagModel>>(
      this._base + '/LinkTagRelation/AddUpdateLinkTagRelations',
      // +'?authorID='loggedUserID,
      tagRelation,
      this._options
    );
  }
}
