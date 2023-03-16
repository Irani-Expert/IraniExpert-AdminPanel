import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { referraluserModel } from '../../../dashboard/referral-user/referral-user.model';
import { OrderModel } from '../models/order.model';
interface INoteSidebar {
  sidenavOpen?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService<OrderModel, 0> {
  userGuid = environment.jwtToken;
  userID: number;

  constructor(public _http: HttpClient, private _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl);
  }
  public sidebarState: INoteSidebar = {
    sidenavOpen: true,
  };
  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getMyOrder(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string
  ): Observable<Result<Paginate<OrderModel[]>>> {
    this.userID = this._auth.currentUserValue.userID;
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<OrderModel[]>>>(
      this._base +
        '/Orders/GetByUserIDe' +
        '?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&pageOrder=' +
        pageOrder +
        '&filter=' +
        filter +
        '&userID=' +
        this.userID,
      _options
    );
  }
  getBysellingTypeQuery(userId: string, sellingType: number) {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<referraluserModel>>(
      this._base +
        '/Orders/GetCommissionByUserIDBySellingTypeQuery?userId=' +
        userId +
        '&SellingType=' +
        sellingType,
      _options
    );
  }
  getByStatus(pageSize: number, pageIndex: number, transactionStatus: number) {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        // Authorization: 'bearer ' + environment.jwtToken,
      }),
    };
    return this._http.get<Result<Paginate<OrderModel[]>>>(
      this._base +
        '/Orders/GetByStatus?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&transactionStatus=' +
        transactionStatus,
      _options
    );
  }
}
