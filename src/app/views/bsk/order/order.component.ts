import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { filter, findIndex } from 'rxjs/operators';
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
import {
  CliamxLicenseModel,
  CliamxResponse,
} from './models/cliamaxLicense.model';
import { LicenseModel } from './models/license.model';
import { LicenseService } from './services/license.service';
import { OrderModel } from './models/order.model';
import { OrderService } from './services/order.service';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { ProductModel } from '../../prd/products-list/product.model';
import { PlanService } from '../../bas/plan/plan.service';
import { PlanModel } from '../../bas/plan/plan.model';
import { List } from 'echarts';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  filters: any;
  statusTitles = [
    { title: 'نهایی', id: 8 },
    { title: 'درانتظار پرداخت', id: 1 },
    { title: 'درانتظار تائید', id: 6 },
    { title: 'تائید شده', id: 2 },
    { title: 'رد شده', id: 5 },
  ];
  dropDownTitleHolder: string = 'نهایی';
  FExpDate: any;
  TExpDate: any;
  FCrtDate: any;
  TCrtDate: any;
  FStrDate: any;
  TStrDate: any;
  filtered: boolean = false;
  filter: FilterModel = new FilterModel();
  licenseID: number;
  isValidate: boolean;
  // accountNumber: number;
  invoiceDetail: InvoiceModel = new InvoiceModel();
  invoiceStatus: number;
  filterModel: FilterModel = new FilterModel();
  plans: PlanModel[] = new Array<PlanModel>();
  productModel: ProductModel[] = new Array<ProductModel>();

  filterForm: FormGroup;
  rows: OrderModel[] = new Array<OrderModel>();
  orderDetail: OrderModel;
  status: any;

  page: Page = new Page();

  viewMode: 'list' | 'grid' = 'list';

  noteRowID: number;
  notes: CommentModel[] = new Array<CommentModel>();
  note: CommentModel = new CommentModel();
  filePathKeeper: string;
  licenseFile: any = '';
  licenseModel: LicenseModel = new LicenseModel();
  startDate: any;
  expireDate: any;
  clientId: number;
  versionNumber: number;

  toggled = false;

  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  dateValue: string = 'تاریخ ثبت به میلادی';

  headerValue: string = 'کد رهگیری';

  user: UserInfoModel;
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
    private auth: AuthenticateService,
    private _planService: PlanService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 6;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this._orderService.getProduct().subscribe((res: Result<ProductModel[]>) => {
      this.productModel = res.data;
    });
    console.log(this.filter);

    this.setPage(this.page.pageNumber, 8);
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
    this._orderService
      .getOrders(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        this.page.size,
        status,
        filter
      )
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
          this.rows = res.data.items;
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
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result === true) {
          this.changePaymentStatus(this.invoiceDetail);
        }
      });
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
    this.notes = new Array<CommentModel>();
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
  toggleNotebar(rowId: number) {
    this.noteRowID = rowId;
    this.getNoteList(rowId);
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
            this.expireDate = res.data.expireDate;
            this.startDate = res.data.startDate;
            this.versionNumber = res.data.versionNumber;
          }
        });

    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        beforeDismiss: () => {
          if (this.filePathKeeper !== this.licenseModel.filePath) {
            return false;
          }
        },
      })
      .result.then((result: boolean) => {
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
      });
  }

  addOrUpdate(item: LicenseModel, climax: CliamxLicenseModel) {
    if (this.expireDate.month < 10) {
      this.expireDate.month = '0' + this.expireDate.month;
    } else {
      this.expireDate.month = this.expireDate.month;
    }
    if (this.expireDate.day < 10) {
      this.expireDate.day = '0' + this.expireDate.day;
    } else {
      this.expireDate.day = this.expireDate.day;
    }
    if (this.startDate.month < 10) {
      this.startDate.month = '0' + this.startDate.month;
    } else {
      this.startDate.month = this.startDate.month;
    }
    if (this.startDate.day < 10) {
      this.startDate.day = '0' + this.startDate.day;
    } else {
      this.startDate.day = this.startDate.day;
    }
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
        this.startDate.month +
        '-' +
        this.startDate.day;
    }
    if (this.expireDate.year !== undefined) {
      item.expireDate =
        this.expireDate.year +
        '-' +
        this.expireDate.month +
        '-' +
        this.expireDate.day;
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
        (result) => {
          if (this.filterModel.rate != null) {
            this.filterModel.rate = Number(this.filterModel.rate);
          }
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
          this.getOrders(this.status, this.page.pageNumber, this.filterModel);
          this.filter = this.filterModel;
          this.fillTheFiltersRow(this.filter);
          this.filtered = true;
        },
        (reason) => {
          this.filterModel = new FilterModel();
        }
      );
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
            this.plans = res.data;
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
    let finder = this.filters.findIndex((filter) => filter.id == item.id);
    this.filters[finder].isFilled = false;
    switch (item.id) {
      case 1:
        this.filter.firstName = undefined;
        break;
      case 2:
        this.filter.lastName = undefined;
        break;
      case 3:
        this.filter.iD = undefined;
        break;
      case 4:
        this.filter.userID = undefined;
        break;
      case 5:
        this.filter.accountNumber = undefined;
        break;
      case 6:
        this.filter.phoneNumber = undefined;
        break;
      case 7:
        this.filter.planID = undefined;
        break;
      case 8:
        this.filter.productID = undefined;
        break;
      case 9:
        this.filter.isAccepted = undefined;
        break;
      case 10:
        this.filter.rate = undefined;
        break;
      case 11:
        this.filter.code = undefined;
        break;
      case 12:
        this.filter.fromExpireDate = undefined;
        break;
      case 13:
        this.filter.toExpireDate = undefined;
        break;
      case 14:
        this.filter.fromStartDate = undefined;
        break;
      case 15:
        this.filter.toStartDate = undefined;
        break;
      case 16:
        this.filter.fromCreateDate = undefined;
        break;
      case 17:
        this.filter.toCreateDate = undefined;
        break;
      case 18:
        this.filter.versionNumber = undefined;
        break;
    }
    this.getOrders(this.status, this.page.pageNumber, this.filter);
  }
  deleteAllFilter() {
    this.filtered = false;
    this.filter = new FilterModel();
    this.filters.forEach((item) => {
      if (item.isFilled == true) {
        item.isFilled = false;
      }
    });
    this.getOrders(this.status, this.page.pageNumber, this.filter);
  }
  fillTheFiltersRow(filter: FilterModel) {
    this.filters = [
      {
        id: 1,
        label: 'نام',
        title: filter.firstName,
        isFilled: false,
      },
      {
        id: 2,
        label: ' نام خانوادگی',
        title: filter.lastName,
        isFilled: false,
      },
      { id: 3, label: 'نام', title: filter.iD, isFilled: false },
      { id: 4, label: 'نام', title: filter.userID, isFilled: false },
      {
        id: 5,
        label: 'شماره حساب',
        title: filter.accountNumber,
        isFilled: false,
      },
      {
        id: 6,
        label: 'شماره تماس',
        title: filter.phoneNumber,
        isFilled: false,
      },
      { id: 7, label: 'نام', title: filter.planID, isFilled: false },
      {
        id: 8,
        label: 'محصول',
        title: filter.productID,
        isFilled: false,
      },
      {
        id: 9,
        label: 'پلن',
        title: filter.isAccepted,
        isFilled: false,
      },
      { id: 10, label: 'نام', title: filter.rate, isFilled: false },
      { id: 11, label: 'نام', title: filter.code, isFilled: false },
      {
        id: 12,
        label: 'از انقضا در',
        title: filter.fromExpireDate,
        isFilled: false,
      },
      {
        id: 13,
        label: ' تا انقضا در',
        title: filter.toExpireDate,
        isFilled: false,
      },
      {
        id: 14,
        label: 'از شروع در',
        title: filter.fromStartDate,
        isFilled: false,
      },
      {
        id: 15,
        label: 'تا شروع در',
        title: filter.toStartDate,
        isFilled: false,
      },
      {
        id: 16,
        label: 'از ایجاد در',
        title: filter.fromCreateDate,
        isFilled: false,
      },
      {
        id: 17,
        label: 'تا ایجاد در',
        title: filter.toCreateDate,
        isFilled: false,
      },
      {
        id: 18,
        label: 'ورژن لایسنس',
        title: filter.versionNumber,
        isFilled: false,
      },
    ];
    this.filters.forEach((item: any) => {
      if (item.title !== undefined && item.title !== null) {
        item.isFilled = true;
      }
    });
  }
}
