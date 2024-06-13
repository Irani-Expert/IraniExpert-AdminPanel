import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { BrokerModel } from './models/broker.model';
import { tagModel } from '../tags/tagModel/tag.model';
import { BrokerItem } from './models/broker-item.model';
interface FilterBrokers {
  title: string;
  items: number[];
}
class FilterBrokerItem {
  accending: boolean = true;
  title: string;
  brokerItemType: number;
}
@Injectable({
  providedIn: 'root',
})
export class BrokersService extends BaseService<any, 0> {
  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };
  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  getBrokers(page: Page, _filter: FilterBrokers) {
    let filterRow = '';
    Object.keys(_filter).forEach((key) => {
      key ? (filterRow += `&${key + '=' + _filter[key]}`) : filterRow;
    });
    return this._http.get<Result<Paginate<BrokerModel[]>>>(
      this._base +
        '/Broker?pageIndex=' +
        page.pageNumber +
        '&pageSize=' +
        page.size +
        filterRow,
      this._options
    );
  }
  getBrokerDetails(id: number) {
    return this._http.get<Result<BrokerModel>>(
      this._base + '/Broker/details?id=' + id,
      this._options
    );
  }
  getTags() {
    return this._http.get<Result<Paginate<tagModel[]>>>(
      this._base + '/LinkTag?pageIndex=0',
      this._options
    );
  }
  getBrokerItems(_filter: FilterBrokerItem) {
    let filterRow = '';
    Object.keys(_filter).forEach((key) => {
      key ? (filterRow += `&${key + '=' + _filter[key]}`) : filterRow;
    });
    return this._http.get<Result<Paginate<BrokerItem[]>>>(
      this._base + '/BrokerItem?pageIndex=0' + filterRow,
      this._options
    );
  }
}
