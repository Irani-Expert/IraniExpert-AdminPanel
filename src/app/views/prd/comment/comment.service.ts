import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { CommentModel } from './commnet.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService  extends BaseService<CommentModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {

    super(_http, environment.api.baseUrl);
   }

    /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
     getCommentByProductId(pageIndex: number, pageSize: number, pageOrder: string, filter: string, productId: string): Observable<Result<CommentModel[]>> {
      let _options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'bearer '+environment.jwtToken
        }),
      };
      return this._http.get<Result<CommentModel[]>>(this._base + "/comment/getCommentByProductId/" + productId +
      "?pagIndex="+pageIndex+
      "&pageSize="+pageSize+
      "&pageOrder="+pageOrder+
      "&filter="+filter+
      "&productId="+productId,
      _options);
    }
}



