import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { LicenseModel } from '../license/license.model';
import { LicenseService } from '../license/license.service';
import { OrderModel } from '../order/order.model';
import { OrderService } from '../order/order.service';

@Component({
  selector: 'app-license-update',
  templateUrl: './license-update.component.html',
  styleUrls: ['./license-update.component.scss'],
})
export class LicenseUpdateComponent implements OnInit {
  licenseFile: any = '';
  loading: boolean = false;
  viewMode: 'list' | 'grid' = 'list';
  rows: OrderModel[] = new Array<OrderModel>();
  page: Page = new Page();
  licenseModel: LicenseModel = new LicenseModel();
  addForm: FormGroup;
  versionNumber: number = 1;
  isValidate: boolean = false;
  constructor(
    private _fileUploaderService: FileUploaderService,
    public _licenseService: LicenseService,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      versionNumber: [null],
    });
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getLicenseIsNeedUpdates(this.page.pageNumber, this.page.size);
  }

  async getLicenseIsNeedUpdates(pageNumber: number, seedNumber: number) {
    this._licenseService
      .getLicenses(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        this.versionNumber
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

  onFileChanged(event: any) {
    let fileType = event.target.files[0].type.split('/');
    if (fileType[1] == 'x-zip-compressed') {
      this.licenseFile = event.target.files[0];
      this.isValidate = true;
    } else {
      this.isValidate = false;
    }
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
  //         this.licenseModel.id=row.licenseID;
  //         console.log(this.licenseModel);
  //         this.addOrUpdate(this.licenseModel);
  //         this.addForm.reset();
  //       }
  //     });
  // }
  // async addOrUpdate(item: LicenseModel) {
  //   await this._licenseService
  //     .update(item.id,item, 'License')
  //      .subscribe(
  //       (data) => {
  //         if (data.success) {
  //           this.toastr.success(data.message, null, {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //           this.setPage(0);
  //         } else {
  //           this.toastr.error(data.message, null, {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         }
  //       }
  //     );
  // }
}
