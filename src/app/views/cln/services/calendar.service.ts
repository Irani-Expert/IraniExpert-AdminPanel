import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { Countries } from '../models/countries.model';
import { CalendarModel } from '../models/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class Calendar extends BaseService<CalendarModel | Countries, number> {
  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }
}
