import { Injectable } from '@angular/core';
import { BaseService } from './baseService/baseService';
import { AuthenticateService } from './auth/authenticate.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class ActionsService extends BaseService<any, 0> {
  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }
}
