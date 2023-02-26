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
import { ordersModel } from 'src/app/shared/models/ordersModel';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Utils } from 'src/app/shared/utils';
import { InvoiceService } from '../invoice/invoice.service';
import { CliamxLicenseModel, CliamxResponse } from '../license/cliamaxLicense.model';
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
  toggled = false;
  rows: OrderModel[] = new Array<OrderModel>();
  viewMode: 'list' | 'grid' = 'list';
  page: Page = new Page();
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  note: OrderModel;
  status: any;
  orderDetail:OrderModel;
  clientId:number;
  addForm: FormGroup;
  startDate: any;
  expireDate: any;
  headerValue:string="ID";
  licenseFile: any = '';
  licenseModel: LicenseModel = new LicenseModel();


  constructor(
    public router: Router,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _fileUploaderService: FileUploaderService,
    private _formBuilder: FormBuilder,
    public _licenseService: LicenseService,

  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this.page.pageNumber=1
    this.addForm = this._formBuilder.group({
      startDate: [null],
      expireDate: [null],
      accountNumber: [null],
    });
    this.setPage(this.page.pageNumber, null);
    this.updateNotebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        if (Utils.isMobile()) {
          this._orderService.sidebarState.sidenavOpen = false;
        }
      });
  }
  setPage(pageInfo: number, transactionStatus: any) {
    this.page.pageNumber = pageInfo;

    this.getOrderbyStatus(transactionStatus);
  }
  test(){
    if(this.headerValue!="Code"){
      this.headerValue="Code"
    }
    else{
      this.headerValue="ID"
    }
    
  }
  getOrderbyStatus(status: any) {
    if(this.status!=status){
      this.page.pageNumber=1
    }
    this.status = status;
    this._orderService
      .getByStatus(6, this.page.pageNumber - 1, status)
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
          this.rows = res.data.items;
          var counter=0
          this.rows.forEach(x=>{
           
            this.rows[counter].createDate=moment(
              this.rows[counter].createDate,
              'YYYY/MM/DD'
            )
              .locale('fa')
              .format('YYYY/MM/DD');
            this.rows[counter].updateDate=moment(
              this.rows[counter].updateDate,
              'YYYY/MM/DD'
            )
              .locale('fa')
              .format('YYYY/MM/DD');
              counter++
          })
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
  openDetailModal(item:OrderModel,openDetails:any){
    this.orderDetail=item
    this.modalService
      .open(openDetails, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      
  }
  openModal(item:OrderModel,openDetails:any){
    this.orderDetail=item
    this.modalService
      .open(openDetails, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      
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
          this.licenseModel.id=row.licenseID;
          console.log(this.licenseModel);
          this.addOrUpdate2(this.licenseModel);
          this.addForm.reset();
        }
      });
  }
  async addOrUpdate2(item: LicenseModel) {
    
    await this._licenseService
      .update(item.id,item, 'License')
      .toPromise()
      .then(
        (data) => {
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
        },
        (_error) => {
          this.toastr.error('خطا مجدد تلاش فرمایید', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      );
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
      .result.then((result) => {
        this._orderService
          .delete(id, 'orders')
          .toPromise()
          .then((res) => {
            if (res.success) {
              this.toastr.success(
                'فرایند حذف موفقیت آمیز بود',
                'موفقیت آمیز!',
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                }
              );
            } else {
              this.toastr.error('خطا در حذف', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
            this.getOrderbyStatus(this.status);
          });
      });
  }

  getNoteList(row: OrderModel) {
    this.note = row;
  }
  toggleNotebar(item: OrderModel) {
    this.getNoteList(item);
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
  changeFinalPrice(discount:string){
    var number = Number(discount.replace(/[^0-9.-]+/g,""));
    this.orderDetail.toPayPrice=this.orderDetail.toPayPrice-number
  }
  openUpdateModal(content: any, row: OrderModel) {
    this.clientId=row.clientId;
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result != undefined) {
          if(this.clientId==null){
            this.licenseModel.rowID = row.id;
            this.addOrUpdate(this.licenseModel,null);
            this.addForm.reset();
          }else{
            let climax=new CliamxLicenseModel();
            climax.file=this.licenseFile;
            climax.accountNumber=this.licenseModel.accountNumber.toString();
            climax.startDate= this.startDate.year +
            '-' +
            this.startDate.month +
            '-' +
            this.startDate.day;

            climax.expireDate=  this.expireDate.year +
            '-' +
            this.expireDate.month +
            '-' +
            this.expireDate.day;
            this.licenseModel.rowID = row.id;
            this.licenseModel.filePath="";
            this.addOrUpdate(this.licenseModel,climax);
            this.addForm.reset();

          }

        }
      });
  }
  
  async addOrUpdate(item: LicenseModel,climax:CliamxLicenseModel) {
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
    await this._licenseService
      .create(item, 'License')
      .toPromise()
      .then(
        (data) => {
          if (data.success) {
            if(climax!==null){
              climax.licenseId=data.data;
              this._licenseService.sendLicenseToClimax(climax).toPromise()
              .then( (dt:CliamxResponse) => {
                if(dt.statusCode!=200){
                  this.toastr.error(dt.message[0], 'خطای Cliamax', {
                    closeButton: true,
                    positionClass: 'toast-top-left',
                  });
                }else{
                  this.toastr.success(dt.message[0], 'تاییدیه کلایمکس', {
                    closeButton: true,
                    positionClass: 'toast-top-left',
                  });
                }
              }).catch((dt) => {
                this.toastr.error(dt[0].message, 'خطای Cliamax', {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
              });
            }
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
        },
        (_error) => {
          this.toastr.error('خطا مجدد تلاش فرمایید', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      );

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
