import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { BannerModel } from './banner.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class BannerService extends BaseService<BannerModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
}
