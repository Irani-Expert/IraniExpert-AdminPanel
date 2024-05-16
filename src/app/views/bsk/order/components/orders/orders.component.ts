import { Component, HostListener, ViewChild } from '@angular/core';
import * as jalali_moment from 'jalali-moment';
import * as moment from 'moment';
import {
  OrderDetailHeader,
  OrdersModel,
  SingleOrderModel,
  TableModel,
} from '../../models/orders-new.model';
import { OrderService } from '../../services/order.service';
import { Page } from 'src/app/shared/models/Base/page';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  lastValueFrom,
  map,
} from 'rxjs';
import { Utils } from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { ItemsBasketComponent } from '../items-basket/items-basket.component';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { CreateNote } from '../notes/create-note';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { Result } from 'src/app/shared/models/Base/result.model';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { LicenseComponent } from '../license/license.component';
import { ProductModel } from 'src/app/views/prd/products-list/product.model';
const transactionsInit: Array<{
  title: string;
  value: number;
  icon?: string;
}> = [
  // {
  //   title: ' تمامی سفارشات',
  //   value: null,
  //   icon: 'inbox',
  // },
  {
    title: ' نهایی',
    value: 8,
    icon: 'check-square',
  },
  {
    title: ' در انتظار پرداخت',
    value: 1,
    icon: 'hourglass',
  },
  {
    title: ' در انتظار تایید',
    value: 6,
    icon: 'pause',
  },
  {
    title: ' تایید شده',
    value: 2,
    icon: 'check-circle',
  },
  {
    title: ' خطا در پرداخت',
    value: 5,
    icon: 'exclamation-triangle',
  },
];
type DetailHeader = { value: string | number; key: string };
enum View {
  ViewAll,
  Add,
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DialogService],
})
export class OrdersComponent {
  openAdvancedFilter = false;
  transactions = transactionsInit;
  transactionIndexHolder = 0;
  products = new Array<ProductModel>();
  view = View.ViewAll;
  @ViewChild(LicenseComponent, { static: false })
  licenseComponent: LicenseComponent;
  @ViewChild(OrderDetailComponent, { static: false })
  orderDetail: OrderDetailComponent;
  @ViewChild(ItemsBasketComponent, { static: false })
  itemsInBsk: ItemsBasketComponent;
  openedModalID = 0;
  // private _actionRoute: string = '';
  wannaSeeModal: boolean = false;
  detailOrderArray = new Array<DetailHeader>();
  singleOrder = new SingleOrderModel();
  modalVisible: boolean = false;
  isDeviceMedium: boolean = false;
  isHijri: boolean = false;
  isCode: boolean = true;
  page: Page = new Page();
  filter = new FilterModel();
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
  searchByNameSubject = new Subject<string>();
  searchByLastNameSubject = new Subject<string>();
  searchByAccountNumberSubject = new Subject<string>();
  searchByLicenseVerSubject = new Subject<string>();
  constructor(
    private auth: AuthenticateService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchByLicenseVerSubject.pipe(debounceTime(700)).subscribe({
      next: (val) => {
        this.filter.versionNumber = val;
        this.page.pageNumber = 0;
        this.getOrders();
      },
    });

    this.searchByNameSubject.pipe(debounceTime(700)).subscribe({
      next: (val) => {
        this.filter.firstName = val;
        this.page.pageNumber = 0;
        this.getOrders();
      },
    });
    this.searchByLastNameSubject.pipe(debounceTime(700)).subscribe({
      next: (val) => {
        this.filter.lastName = val;
        this.page.pageNumber = 0;
        this.getOrders();
      },
    });
    this.searchByAccountNumberSubject.pipe(debounceTime(700)).subscribe({
      next: (val) => {
        this.filter.accountNumber = val;
        this.page.pageNumber = 0;
        this.getOrders();
      },
    });
    this.page.size = 12;
    this.table = {
      headers: this.headers,
      data: new Array<OrdersModel>(),
    };
  }

  async ngOnInit() {
    this.filter.TransactionStatus = 8;
    this.transactionIndexHolder = 0;
    this.activatedRoute.params.subscribe((params) => {
      this.view = View.ViewAll;
      if (
        this.page.currentPage != params['pageId'] ||
        this.table.data.length == 0
      ) {
        this.page.pageNumber = parseInt(params['pageId']) - 1;
        this.getOrders();
      }
    });
    this.getProducts();
    this.updateIsMobileValue();
  }
  async getOrders() {
    this.router.navigateByUrl(`bsk/orders/${this.page.pageNumber + 1}`);
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
              item.hijriCreateDate = jalali_moment(
                item.createDate,
                'YYYY/MM/DD'
              )
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
    this.router.navigateByUrl(`bsk/orders/${pageIndex}`);
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
      this.openAdvancedFilter = false;
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
      setTimeout(() => {
        this.orderDetail.createInvoiceClass();
        this.itemsInBsk.makeTable(this.singleOrder.items);
        this.licenseComponent.createLicenseObj();
      }, 90);
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
  closeModal() {
    this.modalVisible = false;
    this.orderService.singleOrderSubject.next(new SingleOrderModel());
    this.itemsInBsk.ngOnDestroy();
    this.orderDetail.destroyInvoiceModel();
    this.licenseComponent.destroyLicenseObj();
    this.licenseComponent.deleteFile();
  }
  refreshPage() {
    this.modalVisible = false;
    this.itemsInBsk.ngOnDestroy();
    this.orderDetail.destroyInvoiceModel();
    this.licenseComponent.destroyLicenseObj();
    this.orderService.singleOrderSubject.next(new SingleOrderModel());
    this.getOrders();
  }

  // Notes
  orderID: number = -1;
  compileNotesComponent = false;
  sidebarVisible: boolean = false;
  notes = new Array<CommentModel>();
  async openNotesComponent(rowID: number, commentCount: number) {
    this.sidebarVisible = true;
    if (await this.getNotes(rowID, commentCount)) {
      this.notes = this.orderService.notes;
      this.compileNotesComponent = true;
    }
  }
  async getNotes(rowID: number, commentCount: number) {
    if (commentCount > 0 && this.orderID !== rowID) {
      this.orderID = rowID;
      const notesServerRes = this.orderService
        .getByTableTypeandRowId(0, 123456789, null, rowID, 8, 'Comment')
        .pipe(
          map((res) => {
            if (res.success && res.data.totalCount > 0) {
              this.orderService.notesOrderSubject.next(res.data.items);
            }
            return res.success;
          })
        );
      return lastValueFrom(notesServerRes);
    } else {
      if (commentCount == 0) {
        this.notes = new Array<CommentModel>();
      }
      this.orderID = rowID;
      return false;
    }
  }
  noteText = '';
  createNote() {
    let note = new CreateNote(
      this.noteText,
      this.auth.currentUserValue,
      this.orderID
    );
    this.openAdditionModal(note.noteToSend);
  }
  modalRef: DynamicDialogRef | undefined;
  openAdditionModal(_note) {
    this.modalRef = this.dialogService.open(AdditionComponent, {
      data: {
        sendingItem: _note,
        routeOfAction: 'Comment',
      },
      header: 'ایجاد',
      draggable: false,
    });
    this.modalRef.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  modalConfirmed(result: Result<any>) {
    if (result) {
      result.success
        ? this.toastr.success(result.message, '', {
            closeButton: true,
            positionClass: 'toast-top-left',
          })
        : this.toastr.error(
            result.message ||
              'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
            '',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
      this.orderID = -1;
      this.closeSideBar();
      this.getOrders();
      // this.noteText = '';
    } else {
      console.log('Denied Or Server Err');
    }
  }
  closeSideBar() {
    this.sidebarVisible = false;
    this.noteText = '';
  }
  addOrder(event: boolean) {
    if (event) this.view = 0;
    // Another Methods Later !!!
    else this.view = 0;
  }
  async getProducts() {
    if (await this.orderService.getProducts()) {
      this.products = this.orderService.productValue;
    } else {
      console.log('Get Product Failed');
    }
  }

  setTransactionStatus(index: number) {
    this.transactionIndexHolder = index;
    this.filter.TransactionStatus = this.transactions[index].value;
    this.page.pageNumber = 0;
    this.getOrders();
  }

  searchByUsername(event: string) {
    if (event.trim().length !== 0 && event.length > 3) {
      this.searchByNameSubject.next(event);
      return;
    }
    if (event.length == 0 && this.filter.firstName) {
      this.deleteFilter('firstName');
    }
  }
  searchByLastname(event: string) {
    if (event.trim().length !== 0 && event.length > 3) {
      this.searchByLastNameSubject.next(event);
      return;
    }
    if (event.length == 0 && this.filter.lastName) {
      this.deleteFilter('lastName');
    }
  }
  searchByAccountNumber(event: string) {
    if (event.trim().length !== 0 && event.length > 3) {
      this.searchByAccountNumberSubject.next(event);
      return;
    }
    if (event.length == 0 && this.filter.accountNumber) {
      this.deleteFilter('accountNumber');
    }
  }

  searchByLicenseVersion(event: string) {
    if (event.trim().length !== 0 && event.length >= 2) {
      this.searchByAccountNumberSubject.next(event);
      return;
    }
    if (event.length == 0 && this.filter.versionNumber) {
      this.deleteFilter('versionNumber');
    }
  }

  deleteFilter(key: keyof FilterModel) {
    delete this.filter[key];
    this.page.pageNumber = 0;
    this.getOrders();
  }
  deleteAllFilters() {
    this.filter = new FilterModel();
    this.filter.TransactionStatus = 8;
    this.transactionIndexHolder = 0;
    this.page.pageNumber = 0;
    this.getOrders();
  }
  get filteredKeys() {
    const keys = Object.keys(this.filter);
    keys.splice(keys.indexOf('TransactionStatus'), 1);
    return keys;
  }
  createDate: Date | undefined;
  licenseStartDate: Date | undefined;
  licenseExpireDate: Date | undefined;
  changeCreateDate() {
    if (this.createDate[1] !== null) {
      this.filter.toCreateDate = moment(this.createDate[1]).format(
        'YYYY-MM-DD'
      );
    } else {
      delete this.filter.toCreateDate;
    }
    this.filter.fromCreateDate = moment(this.createDate[0]).format(
      'YYYY-MM-DD'
    );

    this.getOrders();
  }

  changeLicenseStartDate() {
    if (this.licenseStartDate[1] !== null) {
      this.filter.toStartDate = moment(this.licenseStartDate[1]).format(
        'YYYY-MM-DD'
      );
    } else {
      delete this.filter.toStartDate;
    }
    this.filter.fromStartDate = moment(this.licenseStartDate[0]).format(
      'YYYY-MM-DD'
    );

    this.getOrders();
  }
  changeLicenseExpDate() {
    if (this.licenseExpireDate[1] !== null) {
      this.filter.toExpireDate = moment(this.licenseExpireDate[1]).format(
        'YYYY-MM-DD'
      );
    } else {
      delete this.filter.toExpireDate;
    }
    this.filter.fromExpireDate = moment(this.licenseExpireDate[0]).format(
      'YYYY-MM-DD'
    );

    this.getOrders();
  }
}

// <!-- Transactions -->
// <ng-container *ngIf="false">
//   <!-- Name -->
//   <div class="col-auto my-3">
//     <span class="p-float-label">
//       <input
//         (input)="searchByUsername($event.target.value)"
//         class="p-inputtext-sm"
//         pInputText
//         id="firstName"
//       />
//       <label class="text-small" htmlFor="firstName">نام</label>
//     </span>
//   </div>
//   <!-- Name -->

//   <!-- Last-Name -->
//   <div class="col-auto my-3">
//     <span class="p-float-label">
//       <input
//         (input)="searchByLastname($event.target.value)"
//         class="p-inputtext-sm"
//         pInputText
//         id="lastName"
//       />
//       <label class="text-small" htmlFor="lastName">نام خانوادگی</label>
//     </span>
//   </div>
//   <!-- Last-Name -->

//   <!-- Account-Number -->
//   <div class="col-auto my-3">
//     <span class="p-float-label">
//       <input
//         (input)="searchByAccountNumber($event.target.value)"
//         class="p-inputtext-sm"
//         pInputText
//         id="accountNumber"
//       />
//       <label class="text-small" htmlFor="accountNumber">شماره حساب</label>
//     </span>
//   </div>
//   <!-- Account-Number -->

//   <!-- Order-Date -->
//   <div class="col-auto my-3">
//     <span class="p-float-label block">
//       <p-calendar
//         dateFormat="yy-mm-dd"
//         (onSelect)="changeCreateDate()"
//         [(ngModel)]="createDate"
//         inputId="createDate"
//         selectionMode="range"
//       >
//       </p-calendar>
//       <label class="text-small" for="createDate"> تاریخ سفارش</label>
//     </span>
//   </div>

//   <!-- Order-Date -->

//   <!-- License-Start-Date -->
//   <div class="col-auto my-3">
//     <span class="p-float-label block">
//       <p-calendar
//         (onSelect)="changeLicenseStartDate()"
//         dateFormat="yy-mm-dd"
//         [(ngModel)]="licenseStartDate"
//         inputId="licenseStartDate"
//         selectionMode="range"
//       >
//       </p-calendar>
//       <label class="text-small" for="licenseStartDate">
//         تاریخ شروع لایسنس</label
//       >
//     </span>
//   </div>

//   <!-- License-Start-Date -->

//   <!-- License-Exp-Date -->
//   <div class="col-auto my-3">
//     <span class="p-float-label block">
//       <p-calendar
//         (onSelect)="changeLicenseExpDate()"
//         dateFormat="yy-mm-dd"
//         [(ngModel)]="licenseExpireDate"
//         inputId="licenseExpireDate"
//         selectionMode="range"
//       >
//       </p-calendar>
//       <label class="text-small" for="licenseExpireDate">
//         تاریخ پایان لایسنس</label
//       >
//     </span>
//   </div>

//   <!-- License-Exp-Date -->
// </ng-container>
