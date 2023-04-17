import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { ProductModel } from './product.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<ProductModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient, public auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, auth);
  }

  getOneByID(
    productId: number,
    route: string
  ): Observable<Result<ProductModel>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<ProductModel>>(
      this._base + '/' + route + '/' + productId,

      _options
    );
  }
}
