import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { StationModel } from './models/station.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileModel } from '../prd/gallery/file.model';

type FilterFiles = {
  fileName: string;
  id: number;
  tableType: number;
  rowId: number;
  fileType: number;
  filePath: string;
  stationId: number;
  isActive: boolean;
};
type ResultFiles = {
  files: Array<FileModel>;
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
  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
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
  getFiles(filterModel: FilterFiles) {
    return this._http.get<Result<ResultFiles>>(
      this._base +
        '/Files/GetDirectoriesContent' +
        (filterModel.fileName == undefined || filterModel.fileName == null
          ? ''
          : '?FileName=' + filterModel.fileName) +
        (filterModel.id == undefined || filterModel.id == null
          ? ''
          : '&ID=' + filterModel.id) +
        (filterModel.tableType == undefined || filterModel.tableType == null
          ? ''
          : '&TableType=' + filterModel.tableType) +
        (filterModel.rowId == undefined || filterModel.rowId == null
          ? ''
          : '&RowID=' + filterModel.rowId) +
        (filterModel.fileType == undefined || filterModel.fileType == null
          ? ''
          : '&FileType=' + filterModel.fileType) +
        (filterModel.filePath == undefined || filterModel.filePath == null
          ? ''
          : '&FilePath=' + filterModel.filePath) +
        (filterModel.stationId == undefined || filterModel.stationId == null
          ? ''
          : '&StationID=' + filterModel.stationId) +
        (filterModel.isActive == undefined || filterModel.isActive == null
          ? ''
          : '&IsActive=' + filterModel.isActive),
      this._options
    );
  }
  // getTableTypes(): Observable<Result<TableType[]>> {
  //   return this._http.get<Result<TableType[]>>(
  //     this._base + '/Public/GetTableType' + '?pageIndex=' + 0 + '&pageOrder=ID',
  //     this._options
  //   );
  // }
}
