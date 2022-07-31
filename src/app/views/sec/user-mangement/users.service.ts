import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { UsersModel } from './users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<UsersModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
}
