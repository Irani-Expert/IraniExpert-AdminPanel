import { Component, HostListener } from '@angular/core';
import * as moment from 'jalali-moment';
import {
  OrderDetailHeader,
  OrdersModel,
  SingleOrderModel,
  TableModel,
} from '../../models/orders-new.model';
import { OrderService } from '../../services/order.service';
import { Page } from 'src/app/shared/models/Base/page';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { lastValueFrom, map } from 'rxjs';
import { Utils } from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
type DetailHeader = { value: string | number; key: string };

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  openedModalID = 0;
  // private _actionRoute: string = '';
  wannaSeeModal: boolean = false;
  detailOrderArray = new Array<DetailHeader>();
  singleOrder = new SingleOrderModel();
  modalVisible: boolean = false;
  sidebarVisible: boolean = false;
  isDeviceMedium: boolean = false;
  isHijri: boolean = false;
  isCode: boolean = true;
  page: Page = new Page();
  filter: FilterModel = new FilterModel();
  headers = [
    'کد رهگیری',
    'تاریخ ثبت',
    'شماره حساب',
    'نام خریدار',
    'محصول',
    'جزئیات',
  ];
  headerValue: 'کد رهگیری' | 'شناسه' = 'کد رهگیری';
  table: TableModel<OrdersModel[]>;
  constructor(
    private auth: AuthenticateService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.page.size = 12;
    this.table = {
      headers: this.headers,
      data: new Array<OrdersModel>(),
    };
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (
        this.page.currentPage != params['pageId'] ||
        this.table.data.length == 0
      ) {
        this.page.pageNumber = parseInt(params['pageId']) - 1;
        this.getOrders();
      }
    });
    this.updateIsMobileValue();
  }
  async getOrders() {
    this.router.navigateByUrl(`bsk/new-orders/${this.page.pageNumber + 1}`);
    return this.orderService
      .getOrdersNew(this.page, this.filter)
      .pipe(
        map((res) => {
          if (res.success) {
            this.page.currentPage = res.data.pageNumber + 1;
            this.page.totalPages = res.data.totalPages;
            this.page.totalElements = res.data.totalCount;
            this.orderService.ordersSubject.next(res.data.items);

            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe({
        next: (val) => {
          if (val) {
            this.orderService.ordersValue.forEach((item) => {
              item.hijriCreateDate = moment(item.createDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD');
            });
          }
        },
        complete: () => {
          this.table.data = this.orderService.ordersValue;
        },
      });
  }
  //Paginate and Filter
  setPage(pageIndex: number) {
    this.page.pageNumber = pageIndex - 1;
    this.router.navigateByUrl(`bsk/new-orders/${pageIndex}`);
    Utils.scrollTopWindow();
  }
  changeHeaderValue(type: number) {
    // 0 == falsy == id => code
    // 1 == gregorian => hijri shamsi
    if (!type) {
      this.isCode = !this.isCode;
      this.headerValue == 'کد رهگیری'
        ? (this.headerValue = 'شناسه')
        : (this.headerValue = 'کد رهگیری');
      this.table.headers[0] = this.headerValue;
    } else this.isHijri = !this.isHijri;
  }

  // Notify When We Reach Mobile Responsive
  updateIsMobileValue() {
    if (Utils.isLMonitor()) {
      this.isDeviceMedium = true;
    } else {
      this.isDeviceMedium = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateIsMobileValue();
  }

  // Modal And Details
  async showModalDialog(id: number) {
    if (await this.getOrderDetails(id)) {
      this.singleOrder = this.orderService.singleOrderValue;
      let detailComponent = new OrderDetailHeader(
        this.singleOrder.orderDetails
      );
      this.detailOrderArray = detailComponent.header;
      this.modalVisible = true;
      this.wannaSeeModal = true;
    }
  }

  //get Details of Selected Order
  async getOrderDetails(id: number) {
    this.openedModalID = id;
    const result = this.orderService.getOrderById(id).pipe(
      map((res) => {
        if (res.success) {
          this.orderService.singleOrderSubject.next(res.data);
        }
        return res.success;
      })
    );
    const finalResult = await lastValueFrom(result);
    return finalResult;
  }
}
