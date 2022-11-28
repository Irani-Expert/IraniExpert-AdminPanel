import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { OrderModel } from '../order/order.model';
import { OrderService } from '../order/order.service';
import { CliamxLicenseModel, CliamxResponse } from './cliamaxLicense.model';
import { LicenseModel } from './license.model';
import { LicenseService } from './license.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent implements OnInit {
  isValidate = false;
  licenseFile: any = '';
  loading: boolean = false;
  viewMode: 'list' | 'grid' = 'list';
  rows: OrderModel[] = new Array<OrderModel>();
  page: Page = new Page();
  licenseModel: LicenseModel = new LicenseModel();
  addForm: FormGroup;
  startDate: any;
  expireDate: any;
  clientId:number;
  licenseId:number;
  constructor(
    private _fileUploaderService: FileUploaderService,
    public _licenseService: LicenseService,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      startDate: [null],
      expireDate: [null],
      accountNumber: [null],
    });
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getOrdersIsPaid(this.page.pageNumber, this.page.size);
  }
  async getOrdersIsPaid(pageNumber: number, seedNumber: number) {
    this._licenseService
      .getOrdersIsPaid(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber
      )
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
          this.rows = res.data.items;
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
  openModal(content: any, row: OrderModel) {
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
            debugger;
            climax.file=this.licenseFile;
            climax.accountNumber=this.licenseModel.accountNumber.toString();
            climax.expireDate= this.startDate.year +
            '-' +
            this.startDate.month +
            '-' +
            this.startDate.day;

            climax.startDate=  this.expireDate.year +
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
              debugger
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
            this.setPage(0);
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
  onFileChanged(event: any) {
    let fileType = event.target.files[0].type.split('/');
      this.licenseFile = event.target.files[0];
      this.isValidate = true;

  }
  uploadFile() {
    this.loading = true;
    this._fileUploaderService
      .uploadLicence(this.licenseFile, 'licenses')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.licenseModel.filePath = res.data[0];
          this.toastr.success('با موفقیت آپلود شد', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.loading = false; // Flag variable
        } else {
          this.toastr.error(res.errors[0], 'خطا در آپلود فایل', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  // uploadFile() {
  //   debugger;

  //   this._fileUploaderService
  //     .uploadFile(this.licenseFile, 'licenses')
  //     .subscribe(
  //       (res: Result<string[]>) => {
  //         if (res.success) {
  //           this.licenseModel.file = res.data[0];
  //           this.toastr.success('با موفقیت آپلود شد', null, {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         } else {
  //           //TODO Delete Set AddUpdate.file
  //           this.licenseModel.file = res.errors[0];
  //           this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         }
  //         //Todo Image={}
  //       },
  //       (error) => {
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
}
