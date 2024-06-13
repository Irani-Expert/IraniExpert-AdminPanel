import { Injectable } from '@angular/core';
import { AllCheckingLog } from './models/all-checking-logModel';
import { environment } from 'src/environments/environment.prod';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { TableType } from './models/table-typeModel';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Observable, delay, repeat, retry } from 'rxjs';
import { LogsModel } from './models/logs.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';

@Injectable({
  providedIn: 'root',
})
export class LogService extends BaseService<Object, number> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
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
  getAllLog(pageIndex, pageSize: number) {
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
      this._base +
        '/MainLogging?' +
        'pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize,
      _options
    );
  }
  updateList(data: AllCheckingLog) {
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

  getLogs(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    tableType: number,
    filter: FilterModel
  ): Observable<Result<Paginate<LogsModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };

    return this._http.get<Result<Paginate<LogsModel[]>>>(
      this._base +
        '/Logging?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        (filter.iD == undefined || filter.iD == null
          ? ''
          : '&ID=' + filter.iD) +
        (filter.fromCreateDate == undefined || filter.fromCreateDate == null
          ? ''
          : '&FromCreateDate=' + filter.fromCreateDate) +
        (filter.toCreateDate == undefined || filter.toCreateDate == null
          ? ''
          : '&ToCreateDate=' + filter.toCreateDate) +
        (filter.requestType == undefined || filter.requestType == null
          ? ''
          : '&RequestType=' + filter.requestType) +
        (tableType == undefined || tableType == null
          ? ''
          : '&TableType=' + tableType) +
        (filter.rowID == undefined || filter.rowID == null
          ? ''
          : '&RowID=' + filter.rowID) +
        (filter.isSuccess == undefined || filter.isSuccess == null
          ? ''
          : '&IsSuccess=' + filter.isSuccess) +
        (filter.ipAddress == undefined || filter.ipAddress == null
          ? ''
          : '&IpAddress=' + filter.ipAddress) +
        (filter.userID == undefined || filter.userID == null
          ? ''
          : '&UserID=' + filter.userID) +
        (filter.firstName == undefined || filter.firstName == null
          ? ''
          : '&FirstName=' + filter.firstName) +
        (filter.lastName == undefined || filter.lastName == null
          ? ''
          : '&LastName=' + filter.lastName) +
        (filter.email == undefined || filter.email == null
          ? ''
          : '&Email=' + filter.email) +
        (filter.accountNumber == undefined || filter.accountNumber == null
          ? ''
          : '&AccountNumber=' + filter.accountNumber) +
        (filter.mainLoggingID == undefined || filter.mainLoggingID == null
          ? ''
          : '&MainLoggingID=' + filter.mainLoggingID) +
        (filter.title == undefined || filter.title == null
          ? ''
          : '&Title=' + filter.title),
      _options
    );
    // .pipe(repeat({
    //   delay: 1000,
    // }),)
  }

  // Get All Logs
}
