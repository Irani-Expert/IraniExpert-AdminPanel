import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { tagModel } from '../../cnt/tags/tagModel/tag.model';
import { CalendarDetailModel } from '../models/calendardetail.model';


@Injectable({
  providedIn: 'root'
})
export class CalendarDetailService extends BaseService<Object, number>  {

  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };

  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }

  getTags() {
    return this._http.get<Result<Paginate<tagModel[]>>>(
      this._base + '/LinkTag?pageIndex=0&accending=false',
      this._options
    );
  }

  GetDetailsAndHistory( countryId: number ) : Observable<Result<CalendarDetailModel>> {
    return this._http.get<Result<CalendarDetailModel>>(
      this._base +
        '/CalendarCountry/GetDetailsAndHistory?id='+
         countryId,
      this._options
    );
  }
}
