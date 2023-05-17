import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Result } from '../models/Base/result.model';

@Injectable()
export class FileUploaderService {
  uploardUrl = environment.uploadUrl;
  mainUrl = environment.api.baseUrl;
  _httpOptions = {
    headers: new HttpHeaders({
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };
  constructor(public _http: HttpClient) {}
  /**
   *  درخواست ایجاد
   * @param t
   * @param route
   * @returns insert
   */
  uploadFile(t: string, folder: string): Observable<Result<string[]>> {
    const payload = new FormData();
    var myFile: Blob = this.dataURItoBlob(t);
    payload.append('file', myFile, 'banner.jpg');
    return this._http.post<Result<string[]>>(
      this.uploardUrl + '?folder=' + folder,
      payload,
      this._httpOptions
    );
  }

  // Delete Request
  deleteFile(filePath: string) {
    return this._http.post<Result<string[]>>(
      this.mainUrl + '/Files/Delete?filePath=' + filePath,
      undefined,
      this._httpOptions
    );
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = `error in ${operation}()`;
      console.error(error); // log to console instead
      return throwError(errMsg);
    };
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpg',
    });
  }
  uploadLicence(_file: any, folder: string): Observable<Result<string[]>> {
    const formData = new FormData();
    formData.append('_file', _file, _file.name);
    return this._http.post<Result<string[]>>(
      this.uploardUrl + '?folder=' + folder,
      formData,
      this._httpOptions
    );
  }
  uploadVoice(_blob: Blob, folder: string): Observable<Result<string[]>> {
    const formData = new FormData();
    formData.append('_file', _blob, 'siavash.mp3');
    return this._http.post<Result<string[]>>(
      this.uploardUrl + '?folder=' + folder,
      formData,
      this._httpOptions
    );
  }
  // dataURItoBlobForVoice(dataURI) {
  //   const base64 = window.atob(dataURI);
  //   console.log(base64);
  // }
}
