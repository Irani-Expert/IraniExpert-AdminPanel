import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { CommentService } from '../../prd/comment/comment.service';
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

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  filter: FilterModel = new FilterModel();
  licenseID: number;
  isValidate: boolean;
  // accountNumber: number;
  invoiceDetail: InvoiceModel = new InvoiceModel();
  invoiceStatus: number;

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
    private auth: AuthenticateService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 6;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber, 8);

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
  clearFilter() {
    this.filter = new FilterModel();
    this.getOrders(this.status, this.page.pageNumber, this.filter);
  }
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
    item = new LicenseModel();
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

    // if (this.licenseID !== null || this.licenseID !== 0) {
    //   this._licenseService
    //     .update(this.licenseID, item, 'License')
    //     .subscribe((data) => {
    //       if (data.success) {
    //         // if ((climax.licenseId = data.data.id)) {
    //         //   this._licenseService
    //         //     .sendLicenseToClimax(climax)
    //         //     .subscribe((dt: CliamxResponse) => {
    //         //       if (dt.statusCode != 200) {
    //         //         this.toastr.error(dt.message[0], 'خطای Cliamax', {
    //         //           closeButton: true,
    //         //           positionClass: 'toast-top-left',
    //         //         });
    //         //       } else {
    //         //         this.toastr.success(dt.message[0], 'تاییدیه کلایمکس', {
    //         //           closeButton: true,
    //         //           positionClass: 'toast-top-left',
    //         //         });
    //         //         this.getOrderbyStatus(this.status, this.page.pageNumber);
    //         //       }
    //         //     });
    //         // }
    //         // var finder = this.rows.findIndex((row) => row.id === item.rowID);
    //         // this.rows[finder].transactionStatus = 8;
    //         // this.rows[finder].accountNumber=item.accountNumber
    //         //this.rows.splice(finder, 1);
    //         this.toastr.success(data.message, null, {
    //           closeButton: true,
    //           positionClass: 'toast-top-left',
    //         });
    //       } else {
    //         this.toastr.error(data.message, null, {
    //           closeButton: true,
    //           positionClass: 'toast-top-left',
    //         });
    //       }
    //     });
    // }
  }
  // } else {
  //   await this._licenseService
  //     .update(item.id, item, 'License')
  //     .toPromise()
  //     .then(
  //       (data) => {
  //         if (data.success) {
  //           this.toastr.success(data.message, null, {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         } else {
  //           this.toastr.error(data.message, null, {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         }
  //       },
  //       (_error) => {
  //         this.toastr.error('خطا مجدد تلاش فرمایید', null, {
  //           closeButton: true,
  //           positionClass: 'toast-top-left',
  //         });
  //       }
  //     );
  //   this.getOrdersIsPaid(this.page.pageNumber, this.page.size);
  // }

  /*
  *
  filterOrders() {
    this.getOrders(this.status, 0, this.filter);
  }

  *
  *
  * 
  */
}
