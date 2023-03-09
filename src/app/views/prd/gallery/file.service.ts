import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { FileModel } from './file.model';

@Injectable({
  providedIn: 'root',
})
export class FileService extends BaseService<FileModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }

  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getFilesByRowIdAndTableType(
    rowId: number,
    tableType: number
  ): Observable<Result<FileModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'bearer ' + environment.jwtToken,
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<FileModel[]>>(
      this._base + `/Files/GetByTableTypeAndRowID/${rowId}/${tableType}`,
      _options
    );
  }
}
