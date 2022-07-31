import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { SecModule } from '../sec.module';
import { UserRoleModel } from './user-role.model';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService extends BaseService<UserRoleModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
}
