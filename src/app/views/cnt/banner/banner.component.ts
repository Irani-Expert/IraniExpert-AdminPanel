import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { BannerModel } from './banner.model';
import { BannerService } from './banner.service';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  // styles: [
  //   `
  //     .dark-modal .modal-content {
  //       background-color: #292b2c;
  //       color: white;
  //     }
  //     .dark-modal .close {
  //       color: white;
  //     }
  //   `,
  // ],
})
export class BannerComponent implements OnInit {
  filePathKeeper: string;
  imageFound: boolean = true;
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  rows: BannerModel[] = new Array<BannerModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  page: Page = new Page();
  image: any;
  cropperSettings: CropperSettings;
  addUpdate: BannerModel;
  addForm: FormGroup;
  constructor(
    public _bannerService: BannerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _fileUploaderService: FileUploaderService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.maxLength(500)])],
      type: [null, Validators.compose([Validators.required])],
      linkType: [null, Validators.compose([Validators.required])],
      fileType: [null, Validators.compose([Validators.required])],
      url: [null],
      isActive: [null],
      filePath: [null],
      fileInfo: [null],
      rowID: [null],
      isRTL:[null],
      orderID: [null, Validators.compose([Validators.required])],
    });
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getBannerList(this.page.pageNumber, this.page.size);
  }

  async getBannerList(pageNumber: number, seedNumber: number) {
    this._bannerService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'Banner'
      )
      .subscribe(
        (res: Result<Paginate<BannerModel[]>>) => {
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
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImagePreview = e.base64;
  }
  imgLoad() {}
  initCropper() {}
  imgFailed() {
    this.toastr.error('لطفا از صحت فایل اطمینان حاصل فرمایید', null, {
      timeOut: 3000,
      positionClass: 'toast-top-left',
      messageClass: 'text-small mt-2',
    });
  }
  deleteModal(item: BannerModel, type: number, modal: any) {
    let modalCentered: boolean;
    if (type == 0) {
      modalCentered = false;
    }
    if (type == 1) {
      modalCentered = true;
    }
    this.modalService
      .open(modal, {
        animation: true,
        centered: modalCentered,
      })
      .result.then(
        (_result) => {
          if (type == 0) {
            this.deleteBanner(item.id);
          }
          if (type == 1) {
            this.deleteImg(item.filePath);
          }
        },
        (_error) => {
          this.toastr.error('انصراف از حذف', null, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  deleteImg(filePath: string) {
    this._fileUploaderService
      .deleteFile(filePath)
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.fileExists = false;
          this.addUpdate.filePath = this.filePathKeeper;

          this.toastr.success('با موفقیت حذف شد', null, {
            closeButton: true,
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.message, 'خطا در حذف تصویر', {
            closeButton: true,
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  deleteBanner(id: number) {
    this._bannerService.delete(id, 'Banner').subscribe((res) => {
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
      this.getBannerList(this.page.pageNumber, this.page.size);
    });
  }
  addorEdit(content: any, row: BannerModel) {
    this.imageFound = true;
    if (row === undefined) {
      row = new BannerModel();
      row.id = 0;
      row.type = null;
      row.fileType = null;
      row.linkType = null;
      row.tableType = null;
      row.fileExists = false;
    }
    this.filePathKeeper = row.filePath;
    this.addUpdate = row;
    console.log(this.addUpdate.filePath);
    // /this.addUpdate.filePath=row.filePath.substring(row.filePath.indexOf('com/')+4)
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        beforeDismiss: () => {
          if (this.filePathKeeper !== this.addUpdate.filePath) {
            if (this.addUpdate.id == 0) {
              this.toastr.show(
                ' لطفا ایجاد را تکمیل کنید یا عکس آپلود شده را حذف کنید',
                null,
                {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                  toastClass: 'bg-light',
                  messageClass: 'text-small mt-2',
                }
              );
            }
            if (this.addUpdate.id !== 0) {
              this.toastr.show(
                ' لطفا ویرایش را تکمیل کنید یا عکس آپلود شده را حذف کنید',
                null,
                {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                  toastClass: 'bg-light',
                  messageClass: 'text-small mt-2',
                }
              );
            }

            return false;
          }
          if (this.addUpdate.id == 0) {
            return true;
          }
        },
      })
      .result.then(
        (result) => {
          if (result === true) {
            this.addOrUpdate(this.addUpdate);
          }
        },
        (reason) => {
          console.log(this.addUpdate.filePath);

          this.onFileChanged(null);
          this.cropImagePreview = null;
        }
      );
  }
  async addOrUpdate(row: BannerModel) {
    if (row.id === 0) {
      this._bannerService.create(row, 'Banner').subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.addForm.reset();
          this.onFileChanged(null);
          this.cropImagePreview = null;
          this.getBannerList(this.page.pageNumber, this.page.size);
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
    } else {
      this._bannerService.update(row.id, row, 'Banner').subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.addForm.reset();
          this.onFileChanged(null);
          this.cropImagePreview = null;
          this.getBannerList(this.page.pageNumber, this.page.size);
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        }
      });
    }
  }
  selectType($event: any) {
    if ($event != undefined) {
      this.addUpdate.type = parseInt($event);
    }
  }
  selectOrderId($event: any) {
    if ($event != undefined) {
      this.addUpdate.orderID = parseInt($event);
    }
  }
  selectlinkType($event: any) {
    if ($event != undefined) {
      this.addUpdate.linkType = parseInt($event);
    }
  }

  selectPath($event: any) {
    if ($event != undefined) {
      this.addUpdate.fileType = parseInt($event);
    }
  }

  uploadFile() {
    this._fileUploaderService
      .uploadFile(this.cropImagePreview, 'banners')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.filePath = res.data[0];
          this.addUpdate.fileExists = true;

          this.toastr.success('با موفقیت آپلود شد', null, {
            timeOut: 2000,
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
}
