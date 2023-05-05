import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Utils } from 'src/app/shared/utils';
import { CommentService } from '../../shr/all-comment/comment.service';
import { InvoiceModel } from './models/invoice.model';
import { InvoiceService } from './services/invoice.service';
import { CliamxLicenseModel } from './models/cliamaxLicense.model';
import { LicenseModel } from './models/license.model';
import { LicenseService } from './services/license.service';
import { OrderModel } from './models/order.model';
import { OrderService } from './services/order.service';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { ProductModel } from '../../prd/products-list/product.model';
import { PlanService } from '../../bas/plan/plan.service';
import { PlanModel } from '../../bas/plan/plan.model';
import { DecimalPipe, formatDate } from '@angular/common';
import { AddOrderModel } from './models/AddOrder.model';
import { number } from 'echarts';
import { UsersModel } from '../../sec/user-mangement/users.model';
import { ProductService } from '../../prd/products-list/product.service';
import { log } from 'console';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [
    trigger('rotate90deg', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('300ms ease-in-out')),
      transition('default => rotated', animate('500ms ease-in-out')),
    ]),
    // trigger('pushDown', [
    //   state('default', style({ margin: '0' })),
    //   state('rotated', style({ margin: '2% 0 0 0' })),
    //   transition('rotated => default', animate('100ms ease-in-out')),
    //   transition('default => rotated', animate('300ms ease-in-out')),
    // ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-40%)', opacity: 0 }),
        animate(
          '500ms ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ transform: 'translateY(-40%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class OrderComponent implements OnInit {
  pageIsLoad: boolean = false;
  filters: Array<{
    id: string;
    label: string;
    title: string | number | boolean;
    isFilled: boolean;
  }> = [];
  statusTitles = [
    { title: 'نهایی', id: 8 },
    { title: 'درانتظار پرداخت', id: 1 },
    { title: 'درانتظار تائید', id: 6 },
    { title: 'تائید شده', id: 2 },
    { title: 'رد شده', id: 5 },
    { title: 'فعال', id: 9 },
  ];
  isDivExpanded: boolean = false;
  stateOfChevron: string = 'default';
  dropDownTitleHolder: string = 'نهایی';
  FExpDate: any;
  TExpDate: any;
  FCrtDate: any;
  TCrtDate: any;
  FStrDate: any;
  TStrDate: any;
  planTitle:string="انتخاب کنید";
  productTitle:string="انتخاب کنید";
  filtered: boolean = false;
  filter: FilterModel = new FilterModel();
  licenseID: number;
  isValidate: boolean;
  // accountNumber: number;
  invoiceDetail: InvoiceModel = new InvoiceModel();
  invoiceStatus: number;
  filterModel: FilterModel = new FilterModel();

  addPlans: PlanModel[] = new Array<PlanModel>();
  AddproductModel: ProductModel[] = new Array<ProductModel>();

  filterForm: FormGroup;
  AddOrderForm: FormGroup;
  rows: OrderModel[] = new Array<OrderModel>();
  orderDetail: OrderModel;
  status: any;

  page: Page = new Page();
  viewMode: 'list' | 'grid' = 'list';

  noteRowID: number;
  notes: CommentModel[] = new Array<CommentModel>();
  note: CommentModel = new CommentModel();
  userInfo: UsersModel = new UsersModel();
  AddOrderModel: AddOrderModel = new AddOrderModel();
  filePathKeeper: string;
  licenseFile: any = '';
  licenseModel: LicenseModel = new LicenseModel();
  startDate: NgbDate = new NgbDate(2023, 4, 3); // A Random Date for Functional Use
  expireDate: NgbDate = new NgbDate(2023, 4, 3); // A Random Date for Functional Use
  clientId: number;
  versionNumber: number;
  productList: ProductModel[] = new Array<ProductModel>();
  plans: PlanModel[] = new Array<PlanModel>();
  toggled = false;
  AddorderSituation: boolean = true;
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  dateValue: string = 'تاریخ ثبت به میلادی';
  headerValue: string = 'کد رهگیری';
  user: UserInfoModel;
  addOrderModalTable: string = 'برای کاربر موجود';
  constructor(
    public router: Router,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _fileUploaderService: FileUploaderService,
    private _formBuilder: FormBuilder,
    public _licenseService: LicenseService,
    public _invoiceService: InvoiceService,
    public _commentService: CommentService,
    private _productService: ProductService,
    private auth: AuthenticateService,
    private _planService: PlanService,
    private _decimalPipe: DecimalPipe
  ) {
    this.page.pageNumber = 0;
    this.page.size = 6;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber, 8);
    this.callOrder();
    this.AddOrderForm = this._formBuilder.group({
      userId: [null],
      productID: [null, Validators.compose([Validators.required])],
      planID: [null, Validators.compose([Validators.required])],
      accountNumber: [null, Validators.compose([Validators.required])],
      discountPrice: [null],
      transactionCode: [null, Validators.compose([Validators.required])],
      price: [null],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      phoneNumber: [null, Validators.compose([Validators.required])],
      email: [null, Validators.email],
    });
    this.filterForm = this._formBuilder.group({
      iD: [null],
      userID: [null],
      accountNumber: [null],
      firstName: [null],
      lastName: [null],
      phoneNumber: [null],
      planID: [null],
      productID: [null],
      isAccepted: [null],
      rate: [null],
      code: [null],
      toExpireDate: [null],
      fromStartDate: [null],
      toStartDate: [null],
      fromExpireDate: [null],
      fromCreateDate: [null],
      versionNumber: [null],
      ToCreateDate: [null],
    });

    this.updateNotebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_routeChange) => {
        if (Utils.isMobile()) {
          this._orderService.sidebarState.sidenavOpen = false;
        }
      });
  }
  callOrder() {
    this._productService
      .get(0, null, 'ID', null, 'Product')
      .subscribe((res) => {
        this.productList = res.data.items;
        debugger
        this.AddproductModel = res.data.items;
      });
  }
  // clearFilter() {
  //   this.filter = new FilterModel();
  //   this.getOrders(this.status, this.page.pageNumber, this.filter);
  // }
  setPage(pageInfo: number, transactionStatus: any) {
    this.page.pageNumber = pageInfo;

    this.getOrders(transactionStatus, pageInfo, this.filter);
  }
  changeHeaderValue() {
    if (this.headerValue != 'کد رهگیری') {
      this.headerValue = 'کد رهگیری';
    } else {
      this.headerValue = 'ID';
    }
  }

  changeDateValue() {
    if (this.dateValue != 'تاریخ ثبت به میلادی') {
      this.dateValue = 'تاریخ ثبت به میلادی';
    } else {
      this.dateValue = ' تاریخ ثبت به شمسی';
    }
  }

  getOrders(status: any, pageNumber: number, filter: FilterModel) {
    let finder = this.statusTitles.findIndex((item) => item.id == status);
    this.dropDownTitleHolder = this.statusTitles[finder].title;
    this.status = status;
    if (this.status == 9) {
      status = 8;
      filter.fromExpireDate = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    }
    this._orderService
      .getOrders(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        this.page.size,
        status,
        filter
      )
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
          if (this.status == 9) {
            filter.fromExpireDate = undefined;
          }
          this.rows = res.data.items;
          this.pageIsLoad = true;
          var counter = 0;
          this.rows.forEach((_x) => {
            this.rows[counter].jalaliDate = moment(
              this.rows[counter].createDate,
              'YYYY/MM/DD'
            )
              .locale('fa')
              .format('YYYY/MM/DD');
            this.rows[counter].updateDate = moment(
              this.rows[counter].updateDate,
              'YYYY/MM/DD'
            )
              .locale('fa')
              .format('YYYY/MM/DD');
            counter++;
          });
          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber + 1;
        },
        (_error) => {
          this.toastr.error(
            'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }
  // async getOrderList(pageNumber: number, seedNumber: number) {
  //   this._orderService
  //     .get(
  //       pageNumber !== 0 ? pageNumber - 1 : pageNumber,
  //       seedNumber,
  //       'ID',
  //       null,
  //       'orders'
  //     )
  //     .subscribe(
  //       (res: Result<Paginate<OrderModel[]>>) => {
  //         this.rows = res.data.items;
  //         this.page.totalElements = res.data.totalCount;
  //         this.page.totalPages = res.data.totalPages - 1;
  //         this.page.pageNumber = res.data.pageNumber + 1;
  //       },
  //       (_error) => {
  //         this.toastr.error(
  //           'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
  //           null,
  //           {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           }
  //         );
  //       }
  //     );
  // }
  openDetailModal(item: OrderModel, openDetails: any) {
    this.orderDetail = item;

    this._invoiceService
      .GetByTableTypeAndRowId(0, 2, 'ID', 'invoice', item.id, 8)
      .subscribe((res: Result<InvoiceModel[]>) => {
        this.invoiceDetail = res.data[0];
      });
    this.modalService
      .open(openDetails, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: false,
      })
      .result.then(
        (result: boolean) => {
          if (result === true) {
            this.changePaymentStatus(this.invoiceDetail);
            this.updateNotebar();
            this.clearNote();
          }
        },
        (reason) => {
          this.updateNotebar();
          this.clearNote();
        }
      );
  }
  selectStatus($event: any) {
    if ($event != undefined) {
      this.invoiceDetail.status = parseInt($event);
    }
  }

  changePaymentStatus(item: InvoiceModel) {
    // var finder = this.rows.findIndex((row) => row.code === item.code);
    this._invoiceService.update(item.id, item, 'invoice').subscribe((data) => {
      if (data.success) {
        this.toastr.success(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
        this.getOrders(this.status, this.page.pageNumber, this.filter);
        // if (item.status == 99) {
        //   this.rows[finder].transactionStatus = 5;
        //   if (this.status == 2 || this.status == 8) {
        //     this.rows.splice(finder, 1);
        //   }
        // } else if (item.status == 3) {
        //   this.rows[finder].transactionStatus = 2;
        // }
      } else {
        this.toastr.error(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    });
  }

  onFileChanged(event: any) {
    let fileType = event.target.files[0].type.split('/');
    if (fileType[1] == 'x-zip-compressed') {
      this.licenseFile = event.target.files[0];
      this.isValidate = true;
    } else {
      this.isValidate = false;
    }
  }
  // updateLicense(content: any, row: OrderModel) {
  //   this.modalService
  //     .open(content, {
  //       size: 'lg',
  //       ariaLabelledBy: 'modal-basic-title',
  //       centered: true,
  //     })
  //     .result.then((result: boolean) => {
  //       if (result != undefined) {
  //         this.licenseModel.rowID = row.id;
  //         this.licenseModel.id = row.licenseID;
  //         console.log(this.licenseModel);
  //         this.addOrUpdate2(this.licenseModel);
  //         // this.addForm.reset();
  //       }
  //     });
  // }
  // async addOrUpdate2(item: LicenseModel) {
  //   this._licenseService.update(item.id, item, 'License').subscribe((data) => {
  //     if (data.success) {
  //       this.toastr.success(data.message, null, {
  //         closeButton: true,
  //         positionClass: 'toast-top-left',
  //       });
  //     } else {
  //       this.toastr.error(data.message, null, {
  //         closeButton: true,
  //         positionClass: 'toast-top-left',
  //       });
  //     }
  //   });
  // }
  uploadFile() {
    this._fileUploaderService
      .uploadLicence(this.licenseFile, 'licenses')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.licenseModel.filePath = res.data[0];
          this.licenseModel.fileExists = true;
          this.isValidate = false;
          this.toastr.success('با موفقیت آپلود شد', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.errors[0], 'خطا در آپلود فایل', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }

  deleteModal(item: any, modal: any, type: number) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: false })
      .result.then((_result) => {
        if (type == 0) {
          this.deleteOrder(item.id);
        }
        if (type == 1) {
          this.deleteFile(item.filePath);
        }
      });
  }
  deleteOrder(id: number) {
    this._orderService.delete(id, 'orders').subscribe((res) => {
      if (res.success) {
        this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
          timeOut: 3000,
          positionClass: 'toast-top-left',
        });
      } else {
        this.toastr.error('خطا در حذف', res.message, {
          timeOut: 3000,
          positionClass: 'toast-top-left',
        });
      }
      this.getOrders(this.status, this.page.pageNumber, this.filter);
    });
  }
  // ///////////// Note List
  // Get Note List

  getNoteList(rowId: number) {
    this._commentService
      .GetByTableTypeAndRowId(0, 20, rowId, 8)
      .subscribe((res: Result<Paginate<CommentModel[]>>) => {
        this.notes = res.data.items;
        var counter = 0;
        this.notes.forEach((_x) => {
          this.notes[counter].jalaliDate = moment(
            this.notes[counter].createDate,
            'YYYY/MM/DD'
          )
            .locale('fa')
            .format('YYYY/MM/DD');
          counter++;
        });
      });
  }
  toggleNotebar(row: OrderModel) {
    this.noteRowID = row.id;
    this.notes = new Array<CommentModel>();
    if (row.commentCount !== 0) {
      this.getNoteList(row.id);
    }
    this.toggled = true;
    const state = this._orderService.sidebarState;

    if (state.sidenavOpen) {
      return (state.sidenavOpen = false);
    }
    if (!state.sidenavOpen) {
      state.sidenavOpen = true;
    }
  }
  updateNotebar() {
    this.toggled = false;
    if (Utils.isMobile()) {
      this._orderService.sidebarState.sidenavOpen = false;
    } else {
      this._orderService.sidebarState.sidenavOpen = false;
    }
  }
  // ConfirmModal and Add Note
  clearNote() {
    this.note = new CommentModel();
  }
  openConfirmationModal(item: CommentModel, content: any) {
    this.user = this.auth.currentUserValue;
    item.rate = 1;
    item.email = this.user.subject;
    item.name = this.user.firstName + ' ' + this.user.lastName;
    item.isActive = true;
    item.rowID = this.noteRowID;
    item.isAccepted = true;
    item.tableType = 8;
    item.parentID = null;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((_result: boolean) => {
        if (_result === true) {
          this._commentService.create(item, 'Comment').subscribe((res) => {
            if (res.success) {
              this.toastr.success('یادداشت ایجاد شد', 'موفقیت آمیز!', {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
              let date = new Date();
              item.createDate = date;
              item.jalaliDate = moment(item.createDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD');
              this.notes.unshift(item);
              let indexOfElement = this.rows.findIndex(
                (row) => row.id == item.rowID
              );
              this.rows[indexOfElement].commentCount += 1;
              this.note = new CommentModel();
            } else {
              this.toastr.error('خطا در ایجاد ', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
          });
        }
      });
  }

  // ConfirmModal Add Note

  // ///////////// Note List

  changeFinalPrice(discount: string) {
    var number = Number(discount.replace(/[^0-9.-]+/g, ''));
    this.orderDetail.toPayPrice = this.orderDetail.toPayPrice - number;
  }
  deleteFile(filePath: string) {
    this._fileUploaderService
      .deleteFile(filePath)
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.licenseModel.fileExists = false;
          this.licenseModel.filePath = this.filePathKeeper;

          this.toastr.success('با موفقیت حذف شد', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.success(res.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  openUpdateModal(content: NgbModal, row: OrderModel) {
    this.licenseModel = new LicenseModel();
    this.filePathKeeper = this.licenseModel.filePath;
    this.clientId = row.clientId;
    this.licenseID = row.licenseID;
    if (this.licenseID !== null)
      this._licenseService
        .getOneByID(this.licenseID, 'License')
        .subscribe((res) => {
          if (res.success) {
            this.licenseModel = res.data;
            this.filePathKeeper = res.data.filePath;

            // sendDateToInputValue

            this.expireDate.year = Number(
              this.licenseModel.expireDate.slice(0, 4)
            );
            this.expireDate.month = Number(
              this.licenseModel.expireDate.slice(5, 7)
            );
            this.expireDate.day = Number(
              this.licenseModel.expireDate.slice(8, 10)
            );
            this.expireDate = new NgbDate(
              this.expireDate.year,
              this.expireDate.month,
              this.expireDate.day
            );
            this.startDate.year = Number(
              this.licenseModel.startDate.slice(0, 4)
            );
            this.startDate.month = Number(
              this.licenseModel.startDate.slice(5, 7)
            );
            this.startDate.day = Number(
              this.licenseModel.startDate.slice(8, 10)
            );
            this.startDate = new NgbDate(
              this.startDate.year,
              this.startDate.month,
              this.startDate.day
            );
            // sendDateToInputValue

            this.versionNumber = res.data.versionNumber;
          }
        });

    this.modalService
      .open(content, {
        size: 'md',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        beforeDismiss: () => {
          if (this.filePathKeeper !== this.licenseModel.filePath) {
            this.toastr.show(
              ' لطفا ایجاد یا ویرایش را تکمیل یا فایل آپلود شده را حذف کنید',
              null,
              {
                closeButton: true,
                positionClass: 'toast-top-left',
                toastClass: 'bg-light',
                messageClass: 'text-small mt-2',
              }
            );
            return false;
          }
        },
      })
      .result.then(
        (result: boolean) => {
          if (result == true) {
            if (this.clientId == null) {
              this.licenseModel.rowID = row.id;
              this.addOrUpdate(this.licenseModel, null);
              // this.addForm.reset();
            }
            // else {
            //   let climax = new CliamxLicenseModel();
            //   climax.file = this.licenseFile;
            //   climax.accountNumber = this.licenseModel.accountNumber.toString();
            //   climax.startDate =
            //     this.startDate.year +
            //     '-' +
            //     this.startDate.month +
            //     '-' +
            //     this.startDate.day;

            //   climax.expireDate =
            //     this.expireDate.year +
            //     '-' +
            //     this.expireDate.month +
            //     '-' +
            //     this.expireDate.day;
            //   this.licenseModel.rowID = row.id;
            //   this.licenseModel.filePath = '';

            //   this.addOrUpdate(this.licenseModel, climax);
            //   // this.addForm.reset();
            // }
          }
        },
        (reason) => {}
      );
  }

  addOrUpdate(item: LicenseModel, _climax: CliamxLicenseModel) {
    if (this.licenseID == null) {
      item = new LicenseModel();
    }
    item.rowID = this.licenseModel.rowID;
    item.expireDate = this.licenseModel.expireDate;
    item.startDate = this.licenseModel.startDate;
    item.filePath = this.licenseModel.filePath;
    item.versionNumber = this.versionNumber;
    if (this.startDate.year !== undefined) {
      item.startDate =
        this.startDate.year +
        '-' +
        (this.startDate.month < 10
          ? '0' + this.startDate.month
          : this.startDate.month) +
        '-' +
        (this.startDate.day < 10
          ? '0' + this.startDate.day
          : this.startDate.day);
    }
    if (this.expireDate.year !== undefined) {
      item.expireDate =
        this.expireDate.year +
        '-' +
        (this.expireDate.month < 10
          ? '0' + this.expireDate.month
          : this.expireDate.month) +
        '-' +
        (this.expireDate.day < 10
          ? '0' + this.expireDate.day
          : this.expireDate.day);
    }
    let sendLicense = {
      rowID: item.rowID,
      filePath: item.filePath,
      versionNumber: item.versionNumber,
      startDate: item.startDate,
      expireDate: item.expireDate,
    };
    if (this.licenseID == undefined) {
      this._licenseService.create(sendLicense, 'License').subscribe((data) => {
        if (data.success) {
          // if (climax !== null) {
          //   climax.licenseId = data.data;
          //   this._licenseService
          //     .sendLicenseToClimax(climax)
          //     .subscribe((dt: CliamxResponse) => {
          //       if (dt.statusCode != 200) {
          //         this.toastr.error(dt.message[0], 'خطای Cliamax', {
          //           closeButton: true,
          //           positionClass: 'toast-top-left',
          //         });
          //       } else {
          //         this.toastr.success(dt.message[0], 'تاییدیه کلایمکس', {
          //           closeButton: true,
          //           positionClass: 'toast-top-left',
          //         });
          //       }
          //     });
          // }
          // var finder = this.rows.findIndex((row) => row.id === item.rowID);
          // this.rows[finder].transactionStatus = 8;
          // this.rows[finder].accountNumber=item.accountNumber
          //this.rows.splice(finder, 1);
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.getOrders(this.status, this.page.pageNumber, this.filter);
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
    }
    if (this.licenseID != undefined) {
      this._licenseService
        .update(this.licenseID, item, 'License')
        .subscribe((data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            // let finder = this.rows.findIndex((row) => row.id === item.rowID)
            this.getOrders(this.status, this.page.pageNumber, this.filter);
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        });
    }
  }

  openFilterModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (_result) => {
          if (this.FCrtDate != null) {
            this.filterModel.fromCreateDate =
              this.FCrtDate.year +
              '-' +
              this.FCrtDate.month +
              '-' +
              this.FCrtDate.day;
          }
          if (this.TCrtDate != null) {
            this.filterModel.toCreateDate =
              this.TCrtDate.year +
              '-' +
              this.TCrtDate.month +
              '-' +
              this.TCrtDate.day;
          }
          if (this.FStrDate != null) {
            this.filterModel.fromStartDate =
              this.FStrDate.year +
              '-' +
              this.FStrDate.month +
              '-' +
              this.FStrDate.day;
          }
          if (this.TStrDate != null) {
            this.filterModel.toStartDate =
              this.TStrDate.year +
              '-' +
              this.TStrDate.month +
              '-' +
              this.TStrDate.day;
          }
          if (this.FExpDate != null) {
            this.filterModel.fromExpireDate =
              this.FExpDate.year +
              '-' +
              this.FExpDate.month +
              '-' +
              this.FExpDate.day;
          }
          if (this.TExpDate != null) {
            this.filterModel.toExpireDate =
              this.TExpDate.year +
              '-' +
              this.TExpDate.month +
              '-' +
              this.TExpDate.day;
          }
          this.filter = this.filterModel;
          this.getOrders(this.status, this.page.pageNumber, this.filterModel);
          this.fillTheFiltersRow(this.filter);
          this.filtered = true;
          this.plans = [];
        },
        (_reason) => {
          this.plans = [];
          this.FCrtDate = null;
          this.TCrtDate = null;
          this.FStrDate = null;
          this.TStrDate = null;
          this.FExpDate = null;
          this.TExpDate = null;
          this.filterModel = new FilterModel();
        }
      );
  }

  addSelectProduct($event: any) {
    if ($event != undefined) {
      this.AddOrderModel.productID = parseInt($event);
    }
    if (this.AddOrderModel.productID !== undefined) {
      this._planService
        .getPlanByProductId(this.AddOrderModel.productID)
        .subscribe((res) => {
          if (res.success == true) {
            this.addPlans = res.data;

            this.addSelectPlan(this.addPlans[0].id);
          }
        });
    }
  }
  addSelectPlan(content: any) {
    if (content != undefined) {
      var palnId = Number(content);
      var plan = this.addPlans.findIndex((x) => x.id === palnId);
      this.AddOrderModel.planID = palnId;
      this.AddOrderModel.price = this.addPlans[plan].price;
      this.AddOrderModel.discountPrice = null;
    } else {
      this.AddOrderModel.price = null;
    }
  }

  selectProduct($event: any) {
    if ($event != undefined) {
      this.filterModel.productID = parseInt($event);
    }
    if (this.filterModel.productID !== undefined) {
      this._planService
        .getPlanByProductId(this.filterModel.productID)
        .subscribe((res) => {
          if (res.success == true) {
            let PlanIndex = this.filters.findIndex((filter) => {
              return filter.label === 'پلن';
            });
            this.sortDeletedPart('planID',PlanIndex)
            this.plans=[]
            this.planTitle = "انتخاب کنید";
            this.plans = res.data;
            if (res.data[0]) {
              this.filterModel.planID = res.data[0].id;
            }
          }
        });
    }
  }
  selectProductPlan($event: any) {
    if ($event != undefined) {
      this.filterModel.planID = parseInt($event);
    }
  }
  deleteFilter(item: any) {
   
    if(item.label=='محصول' ){
      this.productTitle = "انتخاب کنید";
      this.planTitle = "انتخاب کنید";
      delete this.filterModel.planID
      this.plans=[]
      delete this.filterModel.productID
      let PlanIndex = this.filters.findIndex((filter) => {
        return filter.label === 'پلن';
      });
      this.sortDeletedPart('planID',PlanIndex)
    }
    if(item.label=='پلن'){
      this.planTitle = "انتخاب کنید";
      delete this.filterModel.planID
    }
  
  let tempIndex = this.filters.findIndex((filter) => {
    return filter.title === item.title;
  });
   this.sortDeletedPart(item.id,tempIndex)
    }
    sortDeletedPart(id:string,tempIndex:number){

      this.filters.splice(tempIndex, 1);
    this.filter[id] = null;
    let indexOfTheFilter = this.filters.findIndex(
      (filter) => filter.isFilled == true
    );
    if (indexOfTheFilter == -1) {
      this.filtered = false;
    }
    this.getOrders(this.status, this.page.pageNumber, this.filter);
  
    }
  deleteAllFilter() {
    this.planTitle = "انتخاب کنید";
    this.productTitle = "انتخاب کنید";
    this.filtered = false;
    this.filter = new FilterModel();
    this.filters.forEach((item) => {
      item.isFilled = false;
    });
    this.getOrders(this.status, this.page.pageNumber, this.filter);
  }

  fillTheFiltersRow(filter: FilterModel) {
    this.filters = [];
    if (filter.firstName) {
      this.filters.push({
        title: filter.firstName,
        label: 'نام',
        id: 'firstName',
        isFilled: true,
      });
    }
    if (filter.lastName) {
      this.filters.push({
        title: filter.lastName,
        label: 'نام خانوادگی',
        id: 'lastName',
        isFilled: true,
      });
    }
    if (filter.iD) {
      this.filters.push({
        title: filter.iD,
        label: 'ID سفارش',
        id: 'iD',
        isFilled: true,
      });
    }
    if (filter.userID) {
      this.filters.push({
        id: 'userID',
        label: 'ID کاربر',
        title: filter.userID,
        isFilled: true,
      });
    }
    if (filter.accountNumber) {
      this.filters.push({
        id: 'accountNumber',
        label: 'شماره حساب',
        title: filter.accountNumber,
        isFilled: true,
      });
    }
    if (filter.phoneNumber) {
      this.filters.push({
        id: 'phoneNumber',
        label: 'شماره تماس',
        title: filter.phoneNumber,
        isFilled: true,
      });
    }
    if (filter.planID) {
      let planIndex = this.plans.findIndex((item) => item.id === filter.planID);
      this.filters.push({
        id: 'planID',
        label: 'پلن',
        title: this.plans[planIndex].title,
        isFilled: true,
      });
    }
    if (filter.productID) {
      let productIndex = this.productList.findIndex(
        (item) => item.id === filter.productID
      );
      this.filters.push({
        id: 'productID',
        label: 'محصول',
        title: this.productList[productIndex].title,
        isFilled: true,
      });
    }
    if (filter.code) {
      this.filters.push({
        id: 'code',
        label: 'کد رهگیری',
        title: filter.code,
        isFilled: true,
      });
    }
    if (filter.fromExpireDate) {
      this.filters.push({
        title: filter.fromExpireDate.split('-').reverse().join('-'),
        label: 'از انقضا در',
        id: 'fromExpireDate',
        isFilled: true,
      });
    }
    if (filter.toExpireDate) {
      this.filters.push({
        title: filter.toExpireDate.split('-').reverse().join('-'),
        label: ' تا انقضا در',
        id: 'toExpireDate',
        isFilled: true,
      });
    }
    if (filter.fromStartDate) {
      this.filters.push({
        title: filter.fromStartDate.split('-').reverse().join('-'),
        label: 'از شروع در',
        id: 'fromStartDate',
        isFilled: true,
      });
    }
    if (filter.toStartDate) {
      this.filters.push({
        title: filter.toStartDate.split('-').reverse().join('-'),
        label: 'تا شروع در',
        id: 'toStartDate',
        isFilled: true,
      });
    }
    if (filter.fromCreateDate) {
      this.filters.push({
        title: filter.fromCreateDate.split('-').reverse().join('-'),
        label: 'از ایجاد در',
        id: 'fromCreateDate',
        isFilled: true,
      });
    }
    if (filter.toCreateDate) {
      this.filters.push({
        title: filter.toCreateDate.split('-').reverse().join('-'),
        label: 'تا ایجاد در',
        id: 'toCreateDate',
        isFilled: true,
      });
    }
    if (filter.versionNumber) {
      this.filters.push({
        title: filter.versionNumber,
        label: 'نسخه لایسنس',
        id: 'versionNumber',
        isFilled: true,
      });
    }
    if (this.status == 9) {
      this.filters[11].isFilled = false;
    }
  }
  openAddModal(content: any) {
    this.AddOrderForm.controls.userId.valueChanges.subscribe((value) => {
      var NValue = Number(value);
    });
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (_result) => {
          let token = localStorage.getItem('token');
          this.AddOrderModel.token = token;
          if (this.AddOrderModel.discountPrice != null) {
            this.AddOrderModel.discountPrice = Number(
              this.AddOrderModel.discountPrice
            );
          } else {
            this.AddOrderModel.discountPrice = 0;
          }
          this.AddOrderModel.userID == 0
            ? null
            : Number(this.AddOrderModel.userID);
          this._orderService
            .create(this.AddOrderModel, 'Orders/CreateAdminOrder')
            .subscribe((res: Result<number>) => {
              this.AddOrderModel = new AddOrderModel();
              this.AddOrderForm.reset();
              this.userInfo = new UsersModel();
              if (res.success) {
                this.callOrder();

                this.toastr.success(res.message, null, {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
              }
            });
        },
        (reason) => {
          this.AddOrderModel = new AddOrderModel();
        }
      );
  }
  getUserbyUserId() {
    if (
      typeof +this.AddOrderModel.userID === 'number' &&
      !isNaN(+this.AddOrderModel.userID)
    ) {
      this._orderService
        .getUserbyUserId(this.AddOrderModel.userID)
        .subscribe((res: Result<UsersModel>) => {
          this.userInfo = res.data;
          this.AddOrderForm.patchValue({
            firstName: this.userInfo.firstName,
            lastName: this.userInfo.lastName,
            phoneNumber: this.userInfo.phoneNumber,
            email: this.userInfo.email,
          });
          this.AddOrderModel.firstName = this.userInfo.firstName;
          this.AddOrderModel.lastName = this.userInfo.lastName;
          this.AddOrderModel.phoneNumber = this.userInfo.phoneNumber;
          this.AddOrderModel.email = this.userInfo.email;
        });
    } else {
      this.toastr.warning('نوع داده اشتباه است', null, {
        closeButton: true,
        positionClass: 'toast-top-left',
      });
    }
  }
  changeAddTypeofRequest() {
    if (this.addOrderModalTable === 'برای کاربر موجود') {
      this.addOrderModalTable = 'و ثبت نام کاربر';
    } else {
      this.addOrderModalTable = 'برای کاربر موجود';
    }

    this.AddorderSituation = !this.AddorderSituation;
    this.AddOrderForm.reset();
    this.userInfo = new UsersModel();
  }
  setProductId(productId:number,productTitle:string){
    
    this.productTitle=productTitle
this.filterModel.productID=productId
this.selectProduct(productId)

this.filterdata()
}
  setPlan(planId:number,planTitle:string){
    this.filterModel.planID=planId
    this.planTitle=planTitle
    this.filterdata()
      }
      toggleFilters() {
        this.isDivExpanded = !this.isDivExpanded;
        this.stateOfChevron =
          this.stateOfChevron === 'default' ? 'rotated' : 'default';
      }
      filterdata(){
        if (this.FCrtDate != null) {
          this.filterModel.fromCreateDate =
            this.FCrtDate.year +
            '-' +
            this.FCrtDate.month +
            '-' +
            this.FCrtDate.day;
        }
        if (this.TCrtDate != null) {
          this.filterModel.toCreateDate =
            this.TCrtDate.year +
            '-' +
            this.TCrtDate.month +
            '-' +
            this.TCrtDate.day;
        }
        if (this.FStrDate != null) {
          this.filterModel.fromStartDate =
            this.FStrDate.year +
            '-' +
            this.FStrDate.month +
            '-' +
            this.FStrDate.day;
        }
        if (this.TStrDate != null) {
          this.filterModel.toStartDate =
            this.TStrDate.year +
            '-' +
            this.TStrDate.month +
            '-' +
            this.TStrDate.day;
        }
        if (this.FExpDate != null) {
          this.filterModel.fromExpireDate =
            this.FExpDate.year +
            '-' +
            this.FExpDate.month +
            '-' +
            this.FExpDate.day;
        }
        if (this.TExpDate != null) {
          this.filterModel.toExpireDate =
            this.TExpDate.year +
            '-' +
            this.TExpDate.month +
            '-' +
            this.TExpDate.day;
        }
        this.filter = this.filterModel;
        debugger
        this.getOrders(this.status, this.page.pageNumber, this.filterModel);
        this.fillTheFiltersRow(this.filter);
        this.filtered = true;
      }
}
