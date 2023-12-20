import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { UrlModel } from './models/url-list.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { SingleUrlModel } from './models/single-url.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { TableType } from '../Log/models/table-typeModel';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Page } from 'src/app/shared/models/Base/page';

class FilterTableModel {
  tableType: number = null;
  fromUrl: string = undefined;
  destUrl: string = undefined;
}
@Injectable({
  providedIn: 'root',
})
export class UrvService extends BaseService<UrlModel, undefined> {
  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };
  singelUrlSubject = new BehaviorSubject<SingleUrlModel>(null);
  tableTypes$ = new BehaviorSubject<TableType[]>(new Array<TableType>());
  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }
  async getTableTypes() {
    const res = this._http
      .get<Result<TableType[]>>(
        this._base +
          '/Public/GetTableType' +
          '?pageIndex=' +
          0 +
          '&pageOrder=ID',
        this._options
      )
      .pipe(
        map((result) => {
          if (result.success) {
            this.tableTypes$.next(result.data);
          }
          return result.success;
        })
      );

    return lastValueFrom(res);
  }
  getUrls(page: Page, _filter: FilterTableModel) {
    let filterRow = '';
    Object.keys(_filter).forEach((key) => {
      key ? (filterRow += `&${key + '=' + _filter[key]}`) : filterRow;
    });
    return this._http.get<Result<Paginate<UrlModel[]>>>(
      this._base +
        '/URLRedirect?pageIndex=' +
        page.pageNumber +
        '&pageSize=' +
        page.size +
        '&pageOrder=ID' +
        filterRow,
      this._options
    );
  }
}
