import { Component, HostListener, Type } from '@angular/core';
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
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { Utils } from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
type DetailHeader = { value: string | number; key: string };
type OrderDetailItem = {
  id: number;
  tableType: number;
  rowID: number;
  count: number;
  unitPrice: number;
  totalPrice: number;
  discountPrice: number;
  toPayPrice: number;
};
const itemToChangeInit: OrderDetailItem = {
  id: 0,
  tableType: 0,
  rowID: 0,
  count: 0,
  unitPrice: 0,
  totalPrice: 0,
  discountPrice: 0,
  toPayPrice: 0,
};
enum ActionTypes {
  EDIT = 'PUT',
  DELETE = 'DELETE',
  ADD = 'ADD',
}
const Action = ActionTypes;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DialogService],
})
export class OrdersComponent {
  private _actionRoute: string = '';
  itemToChange = new BehaviorSubject<OrderDetailItem>(itemToChangeInit);
  menuItems: MenuItem[] | undefined;
  basketFinalPrices: DetailHeader[];
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
  basketTable = new TableModel<Array<OrderDetailItem>>();
  constructor(
    private toastr: ToastrService,
    public dialogService: DialogService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.menuItems = [
      {
        label: 'ویرایش',
        icon: 'pi pi-pencil',
        iconClass: 'text-danger',
        command: (event) => {
          this.openActionsDialog(event.item.label, Action.EDIT);
        },
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        iconClass: 'text-danger',
        command: () => {
          this.openActionsDialog(this.menuItems[1].label, Action.DELETE);
        },
      },
    ];
    this.page.size = 12;
    this.table = {
      headers: this.headers,
      data: new Array<OrdersModel>(),
    };
  }
  get selectedBskItem() {
    return this.itemToChange.value;
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
      if (await this.makeTable(this.singleOrder.items)) {
        this.modalVisible = true;
        this.wannaSeeModal = true;
      }
    }
  }

  //get Details of Selected Order
  async getOrderDetails(id: number) {
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
  async makeTable(tableItems: Array<OrderDetailItem>) {
    this.basketTable = {
      data: tableItems,
      headers: Object.keys(tableItems[0]),
    };
    this.basketCardMaker();
    return true;
  }
  basketCardMaker() {
    this.basketFinalPrices = new Array<DetailHeader>();
    this.basketFinalPrices.push(
      {
        key: 'totalPrice',
        value: this.singleOrder.orderDetails.totalPrice,
      },
      {
        key: 'discountPrice',
        value: this.singleOrder.orderDetails.discountPrice,
      },
      {
        key: 'toPayPrice',
        value: this.singleOrder.orderDetails.toPayPrice,
      }
    );
  }

  setSelectingItem(item: OrderDetailItem) {
    this.itemToChange.next(item);
  }

  // Actions & Modal
  ref: DynamicDialogRef | undefined;
  async openActionsDialog(label: string, action: string) {
    this.ref = this.dialogService.open(this.getActionComponent(action), {
      data: {
        item: this.selectedBskItem,
        disabledItems:
          action == 'PUT'
            ? [
                'tableType',
                'rowID',
                'id',
                'totalPrice',
                'unitPrice',
                'toPayPrice',
              ]
            : undefined,
        routeOfAction: this._actionRoute,
        command: (item) => {
          return this.calculatePrice(item);
        },
      },
      header: label,
      draggable: false,
    });
    this.ref.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  async modalConfirmed(result: Result<any>) {
    result
      ? this.toastr.success(result.message, '', {
          closeButton: true,
          positionClass: 'toast-top-left',
        })
      : this.toastr.error(
          result.message || 'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
          '',
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
  }
  getActionComponent(action: string) {
    if (action == 'PUT') {
      this._actionRoute = 'OrderNew/UpdateOrderItemAdminAccess';
      return EditComponent;
    }
    if (action == 'DELETE') {
      this._actionRoute = 'OrderNew/UpdateOrderItemAdminAccess';
      return DeleteComponent;
    }
    if (action == 'ADD') {
      this._actionRoute = 'OrderNew/CreateOrderAdminAccess';
      return AdditionComponent;
    }
  }
  calculatePrice(item: OrderDetailItem) {
    if (item.count !== this.selectedBskItem.count) {
      item = this.calculateCount(item);
    }
    if (item.discountPrice !== this.selectedBskItem.discountPrice) {
      item = this.calculateDiscount(item);
    }
    return item;
  }
  calculateCount(item: OrderDetailItem) {
    item.totalPrice = item.count * item.unitPrice;
    item.toPayPrice = item.totalPrice - item.discountPrice;
    return item;
  }
  calculateDiscount(item: OrderDetailItem) {
    if (item.discountPrice > item.totalPrice) {
      item.discountPrice = item.totalPrice;
      item.toPayPrice = 0;
    } else {
      item.toPayPrice = item.totalPrice - item.discountPrice;
    }
    return item;
  }
}

//     res.success
//       ? this.toastr.success(res.message, '', {
//           closeButton: true,
//           positionClass: 'toast-top-left',
//         })
//       : this.toastr.error(res.message, '', {
//           closeButton: true,
//           positionClass: 'toast-top-left',
//         }),
//   error: () => {
//     this.toastr.error('لطفا اتصال خود را بررسی کنید', '', {
//       closeButton: true,
//       positionClass: 'toast-top-left',
//     });
//   },
// });
