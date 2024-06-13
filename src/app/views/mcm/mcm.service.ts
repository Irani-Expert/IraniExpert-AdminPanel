import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { StationModel } from './models/station.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileFilter } from 'src/app/shared/components/file-manager/file-manager/file-filter.model';
import { FileManagerItem } from 'src/app/shared/components/file-manager/file-item/file-manager-item.interface';

type ResultFiles = {
  files: Array<FileManagerItem>;
  folders: Array<string>;
};
@Injectable({
  providedIn: 'root',
})
export class McmService extends BaseService<any, number> {
  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  //GetStationList
  getStations(
    pageIndex: number,
    pageSize: number
  ): Observable<Result<Paginate<StationModel[]>>> {
    return this._http.get<Result<Paginate<StationModel[]>>>(
      this._base +
        '/Station' +
        '?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        'ID',
      this._options
    );
  }
  getFiles(filterModel: FileFilter) {
    let params = new HttpParams();
    Object.keys(filterModel).forEach((it) => {
      params = params.append(it, filterModel[it]);
    });
    return this._http.get<Result<ResultFiles>>(
      this._base + '/Files/GetDirectoriesContent',
      { ...this._options, params }
    );
  }
  // getTableTypes(): Observable<Result<TableType[]>> {
  //   return this._http.get<Result<TableType[]>>(
  //     this._base + '/Public/GetTableType' + '?pageIndex=' + 0 + '&pageOrder=ID',
  //     this._options
  //   );
  // }
}
