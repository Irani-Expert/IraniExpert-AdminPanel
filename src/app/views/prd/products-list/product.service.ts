import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { ProductModel } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService  extends BaseService<ProductModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {

    super(_http, environment.api.baseUrl);
   }



   getOneByID(productId: number , route:string): Observable<Result<ProductModel>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'bearer '+environment.jwtToken
      }),
    };
    return this._http.get<Result<ProductModel>>(this._base + "/" + route+"/"+productId

    ,_options);
  }




}

