import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { SecModule } from '../sec.module';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService<SecModule, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
}
