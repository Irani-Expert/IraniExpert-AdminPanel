import { Injectable } from '@angular/core';
import { AllCheckingLog } from './models/all-checking-logModel';
import { environment } from 'src/environments/environment.prod';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TableType } from './models/table-typeModel';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Observable, retry } from 'rxjs';
import { LogsModel } from './models/logs.model';

@Injectable({
  providedIn: 'root',
})
export class LogService extends BaseService<AllCheckingLog, number> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }
  getAllTableType() {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<TableType[]>>(
      this._base + '/Public/GetTableType',
      _options
    );
  }
  getAllLog(pageIndex,pageSize: number) {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<AllCheckingLog[]>>(
      this._base + '/MainLogging?' + 'pageIndex=' + pageIndex + '&pageSize=' + pageSize,
      _options
    );
  }
  updateList(data: AllCheckingLog) {
    debugger;
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.put<Result<AllCheckingLog>>(
      this._base + '/MainLogging' + '/' + data.id,
      data,
      _options
    );
  }
  removeLog(id) {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.delete<Result<AllCheckingLog>>(
      this._base + '/MainLogging' + '/' + id,
      _options
    );
  }

  // Get All Logs

  getLogs(): Observable<Result<Paginate<LogsModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
      params: new HttpParams().set('pageIndex', 0).set('pageOrder', 'ID'),
    };

    return this._http
      .get<Result<Paginate<LogsModel[]>>>(this._base + '/Logging', _options)
      .pipe(retry(3));
  }

  // Get All Logs
}
