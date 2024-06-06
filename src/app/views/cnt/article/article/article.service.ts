import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { CntModule } from '../../cnt.module';
import { ArticleModel } from './article.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { tagModel } from '../../tags/tagModel/tag.model';
import { tagRelationModel } from '../tagModel/tagRelation.model';
import { Page } from 'src/app/shared/models/Base/page';
import { ArticleFilter } from './article-filter.model';
import { lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService extends BaseService<ArticleModel, 0> {
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
      // Authorization: 'bearer ' + environment.jwtToken,
    }),
  };
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
  updateTags(id: number, tagsModel: tagModel) {
    let loggedUserID = this.auth.currentUserValue.userID;
    return this._http.put<Result<tagModel>>(
      this._base + '/LinkTag/' + id,
      // + '?authorID=' + loggedUserID,
      tagsModel,
      this._options
    );
  }
  addLinkTag(tagsModel: tagModel) {
    // let loggedUserID = this.auth.currentUserValue.userID;
    return this._http.post<Result<tagModel>>(
      this._base + '/LinkTag',
      tagsModel,
      this._options
    );
  }
  async addTagToArticle(tagRelation: tagRelationModel[]) {
    let loggedUserID = this.auth.currentUserValue.userID;
    const res = this._http
      .post<Result<tagModel>>(
        this._base + '/LinkTagRelation/AddUpdateLinkTagRelations',
        //  +loggedUserID,
        tagRelation,
        this._options
      )
      .pipe(
        map((it) => {
          return it;
        })
      );
    return lastValueFrom(res);
  }
  getDetails(id: number, route: string) {
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
    return this._http.get(this._base + '/' + route + '?id=' + id, _options);
  }

  async getArticles(page: Page, groupID?: number) {
    let params = '';
    let i = 0;
    debugger;
    let pageModel = {
      pageIndex: page.pageNumber - 1,
      pageSize: 6,
      accending: false,
    };
    for (let key in pageModel) {
      params += `${i !== 0 ? '&' : ''}${key}=${pageModel[key]}`;
      i++;
    }

    if (groupID && groupID !== 1) {
      params += `&groupID=${groupID}`;
    }
    const res = this._http.get<Result<Paginate<ArticleModel[]>>>(
      `${environment.api.baseUrl}/Article?${params}`,
      this._options
    );

    return await lastValueFrom(res);
  }
}
