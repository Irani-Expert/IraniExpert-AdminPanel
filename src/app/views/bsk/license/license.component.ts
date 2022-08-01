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
import { LicenseModel } from './license.model';
import { LicenseService } from './license.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent implements OnInit {
  fullPath: any = '';
  fileName: any = '';
  licenseFile: any = '';
  loading: boolean = false;
  viewMode: 'list' | 'grid' = 'list';
  rows: OrderModel[] = new Array<OrderModel>();
  page: Page = new Page();
  licenseModel: LicenseModel = new LicenseModel();
  addForm: FormGroup;
  startDate: any;
  expireDate: any;
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
          this.page.pageNumber = res.data.pageNumber;
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
    debugger;
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result != undefined) {
          this.licenseModel.rowID = row.id;
          this.addOrUpdate(this.licenseModel);
          this.addForm.reset();
        }
      });
  }
  async addOrUpdate(item: LicenseModel) {
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
    debugger;
    await this._licenseService
      .create(item, 'License')
      .toPromise()
      .then(
        (data) => {
          if (data.success) {
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
    this.fullPath = document.getElementById('upload');
    this.fileName = this.fullPath.files[0].name;
    this.licenseFile = event.target.files[0];
  }
  uploadFile() {
    debugger;
    this.loading = !this.loading;
    this._fileUploaderService
      .uploadLicence(this.licenseFile, 'licenses')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.loading = false; // Flag variable
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
