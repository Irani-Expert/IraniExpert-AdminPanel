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
import { InvoiceModel } from '../invoice/invoice.model';
import { InvoiceService } from '../invoice/invoice.service';
import {
  CliamxLicenseModel,
  CliamxResponse,
} from '../license/cliamaxLicense.model';
import { LicenseModel } from '../license/license.model';
import { LicenseService } from '../license/license.service';
import { OrderModel } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
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
  dateValue: string = 'تاریخ ثبت ';

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
    this.setPage(this.page.pageNumber, null);

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
  setPage(pageInfo: number, transactionStatus: any) {
    this.page.pageNumber = pageInfo;

    this.getOrderbyStatus(transactionStatus, pageInfo);
  }
  changeHeaderValue() {
    if (this.headerValue != 'کد رهگیری') {
      this.headerValue = 'کد رهگیری';
    } else {
      this.headerValue = 'ID';
    }
  }
  changeDateValue() {
    if (this.dateValue != 'تاریخ ثبت ') {
      this.dateValue = 'تاریخ ثبت ';
    } else {
      this.dateValue = ' تاریخ ثبت به شمسی';
    }
  }
  getOrderbyStatus(status: any, pageNumber: number) {
    this.status = status;
    this._orderService
      .getByStatus(
        this.page.size,
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        status
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
        this.getOrderbyStatus(this.status, this.page.pageNumber);
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
    this.licenseFile = event.target.files[0];
  }
  updateLicense(content: any, row: OrderModel) {
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result != undefined) {
          this.licenseModel.rowID = row.id;
          this.licenseModel.id = row.licenseID;
          console.log(this.licenseModel);
          this.addOrUpdate2(this.licenseModel);
          // this.addForm.reset();
        }
      });
  }
  async addOrUpdate2(item: LicenseModel) {
    await this._licenseService
      .update(item.id, item, 'License')
      .subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  uploadFile() {
    this._fileUploaderService
      .uploadLicence(this.licenseFile, 'licenses')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.licenseModel.filePath = res.data[0];
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
  deleteOrder(id: number, modal: any) {
    console.log(this.status);

    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {
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
          this.getOrderbyStatus(this.status, this.page.pageNumber);
        });
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
  openUpdateModal(content: NgbModal, row: OrderModel) {
    this.clientId = row.clientId;
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result != undefined) {
          if (this.clientId == null) {
            this.licenseModel.rowID = row.id;
            this.addOrUpdate(this.licenseModel, null);
            // this.addForm.reset();
          } else {
            let climax = new CliamxLicenseModel();
            climax.file = this.licenseFile;
            climax.accountNumber = this.licenseModel.accountNumber.toString();
            climax.startDate =
              this.startDate.year +
              '-' +
              this.startDate.month +
              '-' +
              this.startDate.day;

            climax.expireDate =
              this.expireDate.year +
              '-' +
              this.expireDate.month +
              '-' +
              this.expireDate.day;
            this.licenseModel.rowID = row.id;
            this.licenseModel.filePath = '';

            this.addOrUpdate(this.licenseModel, climax);
            // this.addForm.reset();
          }
        }
      });
  }

  async addOrUpdate(item: LicenseModel, climax: CliamxLicenseModel) {
    item.versionNumber = this.versionNumber;

    item.startDate =
      this.startDate.year +
      '-' +
      this.startDate.month +
      '-' +
      this.startDate.day;

    item.expireDate =
      this.expireDate.year +
      '-' +
      this.expireDate.month +
      '-' +
      this.expireDate.day;

    this.licenseModel = item;
    await this._licenseService.create(item, 'License').subscribe((data) => {
      if (data.success) {
        if (climax !== null) {
          climax.licenseId = data.data;
          this._licenseService
            .sendLicenseToClimax(climax)
            .subscribe((dt: CliamxResponse) => {
              if (dt.statusCode != 200) {
                this.toastr.error(dt.message[0], 'خطای Cliamax', {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
              } else {
                this.toastr.success(dt.message[0], 'تاییدیه کلایمکس', {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
              }
            });
        }
        var finder = this.rows.findIndex((row) => row.id === item.rowID);
        this.rows[finder].transactionStatus = 8;
        // this.rows[finder].accountNumber=item.accountNumber
        //this.rows.splice(finder, 1);
        this.toastr.success(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      } else {
        this.toastr.error(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    });

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
  }
}
