import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Result } from '../models/Base/result.model';

@Injectable()
export class FileUploaderService {
  // public static BASE_API_URL = 'http://192.168.2.171:2233/api';
  url = environment.uploadUrl;

  constructor(public _http: HttpClient) {}
  /**
   *  درخواست ایجاد
   * @param t
   * @param route
   * @returns insert
   */
  uploadFile(t: string, folder: string): Observable<Result<string[]>> {
    const payload = new FormData();
    var myFile:Blob=this.dataURItoBlob(t);
    debugger
    payload.append('file',myFile,"banner.jpg");
    return this._http.post<Result<string[]>>(
      this.url + '?folder=' + folder,
      payload,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers':
            'origin,X-Requested-With,content-type,accept',
          'Access-Control-Allow-Credentials': 'true',
        }),
      }
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
}
