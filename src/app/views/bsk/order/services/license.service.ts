import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { LicenseModel } from '../models/license.model';

@Injectable({
  providedIn: 'root',
})
export class LicenseService extends BaseService<LicenseModel, 0> {
  userGuid = environment.jwtToken;
  licenseSubject = new BehaviorSubject(new LicenseModel());
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  get _licenseValue() {
    return this.licenseSubject.value;
  }
}
