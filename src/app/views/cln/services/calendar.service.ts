import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { CountriesModel } from '../models/countries.model';
import { CalendarModel } from '../models/calendar.model';
import { Observable } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService extends BaseService<Object, number> {
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }

  // Get All Events
  getCalendarEvent(
    pageIndex: number,
    pageSize: number,
    filter: FilterModel
  ): Observable<Result<Paginate<CalendarModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<CalendarModel[]>>>(
      this._base +
        '/CalendarEvent?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        (filter.iD == undefined || filter.iD == null
          ? ''
          : '&ID=' + filter.iD) +
        (filter.type == undefined || filter.type == null
          ? ''
          : '&Type=' + filter.type) +
        (filter.sector == undefined || filter.sector == null
          ? ''
          : '&Sector=' + filter.sector) +
        (filter.frequency == undefined || filter.frequency == null
          ? ''
          : '&Frequency=' + filter.frequency) +
        (filter.timeMode == undefined || filter.timeMode == null
          ? ''
          : '&TimeMode=' + filter.timeMode) +
        (filter.unit == undefined || filter.unit == null
          ? ''
          : '&Unit=' + filter.unit) +
        (filter.importance == undefined || filter.importance == null
          ? ''
          : '&Importance=' + filter.importance) +
        (filter.multiplier == undefined || filter.multiplier == null
          ? ''
          : '&Multiplier=' + filter.multiplier) +
        (filter.digits == undefined || filter.digits == null
          ? ''
          : '&Digits=' + filter.digits) +
        (filter.sourceUrl == undefined || filter.sourceUrl == null
          ? ''
          : '&Source_Url=' + filter.sourceUrl) +
        (filter.eventCode == undefined || filter.eventCode == null
          ? ''
          : '&Event_Code=' + filter.eventCode) +
        (filter.name == undefined || filter.name == null
          ? ''
          : '&Name=' + filter.name) +
        (filter.countryID == undefined || filter.countryID == null
          ? ''
          : '&CountryID=' + filter.countryID),
      _options
    );
  }

  getCalendarCountries(
    name: string
  ): Observable<Result<Paginate<CountriesModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<CountriesModel[]>>>(
      this._base +
        '/CalendarCountry?pageIndex=' +
        0 +
        (name == undefined || name == null ? '' : '&Name=' + name),
      _options
    );
  }

  getTelegramStatus() {
    let telegramRoute = ' https://climax.iraniexpert.ir/api/Test/TelegramCal';
    // let authorParam = `?authorID=${this._auth.currentUserValue.userID}`;
    let _options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer anonymous',
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<string>>(telegramRoute, _options);
  }
}
