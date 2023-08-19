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
    pageOrder:number,
  ) {
    
    return this._http.get<Result<tagModel[]>>(
      this._base +
        '/LinkTag?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder='+
        pageOrder+
        (filter.iD ? '&ID=' + filter.iD : '') +
        (filter.title ? '&Title=' + filter.title : '') +
        (filter.groupID ? '&GroupID=' + filter.groupID : '') +
        (filter.rowID ? '&RowID=' + filter.rowID : '') +
        (filter.TableType ? '&TableType=' + filter.TableType : '') +
        (filter.fromCreateDate !== undefined ? '&FromCreateDate=' + filter.fromCreateDate : '') +
        (filter.toCreateDate ? '&ToCreateDate=' + filter.toCreateDate : '') +
        (filter.fromUpdateDate? '&FromUpdateDate=' + filter.fromUpdateDate: '') +
        (filter.toUpdateDate ? '&ToUpdateDate=' + filter.toUpdateDate : ''),

      this._options
    );
  }
  updateTags(id:number,tagsModel:tagModel){
    let loggedUserID = this.auth.currentUserValue.userID;
    return this._http.put<Result<tagModel>>(
      this._base + '/LinkTag/' + id + '?authorID=' + loggedUserID,
      tagsModel,
      this._options
    );
  }
  addLinkTag(tagsModel:tagModel){
    let loggedUserID = this.auth.currentUserValue.userID;
    return this._http.post<Result<tagModel>>(
      this._base + '/LinkTag?authorID=' + loggedUserID,
      tagsModel,
      this._options
    );
  }
}
