import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { OrderItemBasket } from '../models/AddOrder.interface';
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
  itemsInBsk = new BehaviorSubject<Array<OrderItemBasket>>([]);
  productsBSubject = new BehaviorSubject<ProductModel[]>(
    new Array<ProductModel>()
  );
  constructor(public _http: HttpClient, public _auth: AuthenticateService) {
    super(_http, environment.api.baseUrl, _auth);
  }
  public sidebarState: INoteSidebar = {
    sidenavOpen: true,
  };

  public get basketItemsToAdd() {
    return this.itemsInBsk.value;
  }
  public get notes() {
    return this.notesOrderSubject.value;
  }
  public get ordersValue() {
    return this.ordersSubject.value;
  }
  public get singleOrderValue() {
    return this.singleOrderSubject.value;
  }
  public get productValue() {
    return this.productsBSubject.value;
  }
  /**
   * درخواست دریافت همه
   * @param route
   * @returns all
   */
  getUserbyUserId(userId: number) {
    return this._http.get<Result<Paginate<UsersModel[]>>>(
      this._base + '/AspNetUser?pageIndex=0' + `&ID=${userId}`,
      this._options
    );
  }
  getMyProfile(id: number) {
    return this._http.get<Result<UsersModel>>(
      this._base + '/AspNetUser/' + id,
      this._options
    );
  }
  getUserbyFirstName(name: string) {
    return this._http.get<Result<Paginate<UsersModel[]>>>(
      this._base + '/AspNetUser?pageIndex=0' + `&FirstName=${name}`,
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
        '/OrderNew/MyOrder' +
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
  getOrdersNew(page: Page, _filter: FilterModel) {
    let filterRow = '';
    Object.keys(_filter).forEach((key) => {
      key && _filter[key]
        ? (filterRow += `&${key + '=' + _filter[key]}`)
        : filterRow;
    });
    return this._http.get<Result<Paginate<OrdersModel[]>>>(
      this._base +
        '/OrderNew/GetOrders?pageIndex=' +
        page.pageNumber +
        '&pageSize=' +
        page.size +
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
  async getProducts() {
    const res = this.get(0, null, 'ID', null, 'Product').pipe(
      map((res) => {
        this.productsBSubject.next(res.data.items);
        return res.success;
      })
    );
    return await lastValueFrom(res);
  }
  get basketTotalPrice() {
    let price = 0;
    this.basketItemsToAdd.forEach((it) => (price += it.price));
    return price;
  }
}
