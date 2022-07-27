import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  pageIndex = 1;
  pageSize = 12;
  licenseModel: LicenseModel;
  addForm: FormGroup;
  constructor(
    private _fileUploaderService: FileUploaderService,
    public _licenseService: LicenseService,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group({
      title: [null],
      startDate: [null],
      expireDate: [null],
      file: [null],
      userID: [null],
    });
  }

  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getOrderList(this.pageIndex, this.pageSize);
  }
  async getOrderList(pageNumber: number, seedNumber: number) {
    this._orderService
      .get(pageNumber, seedNumber, 'ID', null, 'orders')
      .subscribe(
        (res: Result<OrderModel[]>) => {
          this.rows = res.data;
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
  openModal(content: any, item: LicenseModel) {
    this.licenseModel = item;
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result != undefined) {
          this.addOrUpdate(this.licenseModel);
          this.addForm.reset();
        }
      });
  }
  async addOrUpdate(item: LicenseModel) {
    if (item.id === 0) {
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
    } else {
      await this._licenseService
        .update(item.id, item, 'License')
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
      this.getOrderList(this.pageIndex, this.pageIndex);
    }
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
          this.licenseFile = res.data[0];
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
