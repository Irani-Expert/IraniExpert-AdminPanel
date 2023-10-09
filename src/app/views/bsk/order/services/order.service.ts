import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { ProductModel } from 'src/app/views/prd/products-list/product.model';
import { UsersModel } from 'src/app/views/sec/user-mangement/users.model';
import { environment } from 'src/environments/environment.prod';
import { referraluserModel } from '../../../dashboard/referral-user/referral-user.model';
import { OrderModel } from '../models/order.model';
import { Page } from 'src/app/shared/models/Base/page';
import { OrdersModel, SingleOrderModel } from '../models/orders-new.model';
import { BehaviorSubject, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommentModel } from 'src/app/shared/models/comment.model';
interface INoteSidebar {
  sidenavOpen?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService<any, 0> {
  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    }),
  };
  userGuid = environment.jwtToken;
  userID: number;
  ordersSubject: BehaviorSubject<OrdersModel[]> = new BehaviorSubject<
    Array<OrdersModel>
  >(new Array<OrdersModel>());
  singleOrderSubject = new BehaviorSubject<SingleOrderModel>(
    new SingleOrderModel()
  );
  notesOrderSubject = new BehaviorSubject<CommentModel[]>(
    new Array<CommentModel>()
  );
  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }
  public sidebarState: INoteSidebar = {
    sidenavOpen: true,
  };

  public get notes() {
    return this.notesOrderSubject.value;
  }
  public get ordersValue() {
    return this.ordersSubject.value;
  }
  public get singleOrderValue() {
    return this.singleOrderSubject.value;
  }
  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getUserbyUserId(userId: number) {
    return this._http.get<Result<UsersModel>>(
      this._base + '/AspNetUser/' + userId,
      this._options
    );
  }
  getMyOrder(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    filter: string
  ): Observable<Result<Paginate<OrderModel[]>>> {
    this.userID = this._auth.currentUserValue.userID;

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
      this._options
    );
  }
  getBysellingTypeQuery(userId: string, sellingType: number) {
    return this._http.get<Result<referraluserModel>>(
      this._base +
        '/Orders/GetCommissionByUserIDBySellingTypeQuery?userId=' +
        userId +
        '&SellingType=' +
        sellingType,
      this._options
    );
  }
  getProduct() {
    return this._http.get<Result<ProductModel[]>>(
      this._base + '/Product?pageIndex=0',
      this._options
    );
  }
  getOrders(
    pageIndex: number,
    pageSize: number,
    transactionStatus: number,
    filter: FilterModel
  ) {
    return this._http.get<Result<Paginate<OrderModel[]>>>(
      this._base +
        '/Orders?pageIndex=' +
        pageIndex +
        '&pageSize=' +
        pageSize +
        '&TransactionStatus=' +
        transactionStatus +
        (filter.iD == undefined || filter.iD == null
          ? ''
          : '&ID=' + filter.iD) +
        (filter.firstName == undefined || filter.firstName == null
          ? ''
          : '&FirstName=' + filter.firstName) +
        (filter.lastName == undefined || filter.lastName == null
          ? ''
          : '&LastName=' + filter.lastName) +
        (filter.accountNumber == undefined || filter.accountNumber == null
          ? ''
          : '&AccountNumber=' + filter.accountNumber) +
        (filter.fromCreateDate == undefined || filter.fromCreateDate == null
          ? ''
          : '&FromCreateDate=' + filter.fromCreateDate) +
        (filter.toCreateDate == undefined || filter.toCreateDate == null
          ? ''
          : '&ToCreateDate=' + filter.toCreateDate) +
        (filter.phoneNumber == undefined || filter.phoneNumber == null
          ? ''
          : '&PhoneNumber=' + filter.phoneNumber) +
        (filter.planID == undefined || filter.planID == null
          ? ''
          : '&PlanID=' + filter.planID) +
        (filter.productID == undefined || filter.productID == null
          ? ''
          : '&ProductID=' + filter.productID) +
        (filter.code == undefined || filter.code == null
          ? ''
          : '&Code=' + filter.code) +
        (filter.fromStartDate == undefined || filter.fromStartDate == null
          ? ''
          : '&FromStartDate=' + filter.fromStartDate) +
        (filter.toStartDate == undefined || filter.toStartDate == null
          ? ''
          : '&ToStartDate=' + filter.toStartDate) +
        (filter.fromExpireDate == undefined || filter.fromExpireDate == null
          ? ''
          : '&FromExpireDate=' + filter.fromExpireDate) +
        (filter.toExpireDate == undefined || filter.toExpireDate == null
          ? ''
          : '&ToExpireDate=' + filter.toExpireDate) +
        (filter.versionNumber == undefined || filter.versionNumber == null
          ? ''
          : '&VersionNumber=' + filter.versionNumber) +
        (filter.userID == undefined || filter.userID == null
          ? ''
          : '&UserID=' + filter.userID),
      this._options
    );
  }

  getOrdersNew(page: Page, _filter: FilterModel) {
    let filterRow = '';
    Object.keys(_filter).forEach((key) => {
      key ? (filterRow += `&${key + '=' + _filter[key]}`) : filterRow;
    });
    return this._http.get<Result<Paginate<OrdersModel[]>>>(
      this._base +
        '/OrderNew/GetOrders?pageIndex=' +
        page.pageNumber +
        '&pageSize=' +
        page.size +
        '&pageOrder=ID' +
        filterRow,
      this._options
    );
  }
  getOrderById(id: number) {
    return this._http.get<Result<SingleOrderModel>>(
      `${this._base}/OrderNew/${id}`,
      this._options
    );
  }
}
