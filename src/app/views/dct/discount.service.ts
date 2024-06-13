import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DiscountModel } from './discount/discount.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { FilterDiscount } from './discount/discount-filter.interface';
import { lastValueFrom, map } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';

@Injectable({
  providedIn: 'root',
})
export class DiscountService extends BaseService<DiscountModel, number> {
  userGuid = environment.jwtToken;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control':
      'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    Pragma: 'no-cache',
    Expires: '0',
  });
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }

  async getAll(pageNumber: number, filter: FilterDiscount) {
    const url = environment.api.baseUrl + '/' + 'Discount';
    const filterToSet = {
      pageNumber,
      pageSize: 25,
      pageOrder: 'ID',
    };
    Object.keys(filter).forEach((it: keyof FilterDiscount) => {
      filterToSet[it] = filter[it];
    });
    const params = new HttpParams({
      fromObject: filterToSet,
    });

    const res = this._http
      .get<Result<Paginate<DiscountModel[]>>>(url, {
        params,
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          // res.data.items.forEach((it) => {
          //   it.expireDate = moment(it.expireDate)
          //     .locale('fa')
          //     .format('YYYY-MM-DD');
          //   it.createDate = moment(it.createDate)
          //     .locale('fa')
          //     .format('YYYY-MM-DD');
          //   it.updateDate = moment(it.updateDate)
          //     .locale('fa')
          //     .format('YYYY-MM-DD');
          // });
          return res;
        })
      );
    return lastValueFrom(res);
  }
}
