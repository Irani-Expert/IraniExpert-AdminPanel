import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { UserNeedModel } from './user-need.model';
interface INoteSidebar {
  sidenavOpen?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UserNeedService extends BaseService<UserNeedModel, 0> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  public sidebarState: INoteSidebar = {
    sidenavOpen: true,
  };
}
