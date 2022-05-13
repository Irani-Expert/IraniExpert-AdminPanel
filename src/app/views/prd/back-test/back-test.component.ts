import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ProductModel } from '../products-list/product.model';
import { BackTestModel } from './back-test.model';
import { BackTestService } from './back-test.service';

@Component({
  selector: 'app-back-test',
  templateUrl: './back-test.component.html',
  styleUrls: ['./back-test.component.scss'],
})
export class BackTestComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: BackTestModel[] = new Array<BackTestModel>();
  @Input() productId: number;
  pageIndex = 1;
  pageSize = 12;
  addUpdate: BackTestModel;
  addForm: FormGroup;
  cropperSettings: CropperSettings;
  image: any;

  constructor(
    public _backtestService: BackTestService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _fileUploaderService: FileUploaderService
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group(
      {
        title: [null, Validators.compose([Validators.required])],
        description: [null],
        product: [null, Validators.compose([Validators.required])],
        videoUrl: [null],
        fileUrl: [null],
        cardImagePath: [null],
      },
      { validator: this.checkValidFileOrUrl }
    );
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 500;
    this.cropperSettings.height = 300;
    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.image = {};
  }
  checkValidFileOrUrl(g: FormGroup) {
    if (g.get('videoUrl').value !== null || g.get('fileUrl').value !== null)
      return true;
  }

  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getBackTestListByProductId(this.pageIndex, this.pageSize);
  }

  async getBackTestListByProductId(pageNumber: number, seedNumber: number) {
    await this._backtestService
      .getBackTestByProductId(
        pageNumber,
        seedNumber,
        'ID',
        'backtest',
        this.productId
      )
      .subscribe(
        (res: Result<BackTestModel[]>) => {
          this.rows = res.data;
          //  this.page.totalElements = res.data.length;
        },
        (error) => {
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

  uploadFile(image) {
    this._fileUploaderService
      .uploadFile(this.image.image, 'articles')
      .subscribe(
        (res: Result<string[]>) => {
          debugger;
          if (res.success) {
            this.addUpdate.cardImagePath = res.data[0];
            this.toastr.success('با موفقیت آپلود شد', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            //TODO Delete Set AddUpdate.cardImagePAth
            this.addUpdate.cardImagePath = res.errors[0];
            this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
          //Todo Image={}
        },
        (error) => {
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

  deleteBackTest(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._backtestService
            .delete(id, 'backtest')
            .toPromise()
            .then((res) => {
              if (res.success) {
                debugger;
                this.toastr.success(
                  'فرایند حذف موفقیت آمیز بود',
                  'موفقیت آمیز!',
                  {
                    timeOut: 3000,
                    positionClass: 'toast-top-left',
                  }
                );
              } else {
                debugger;

                this.toastr.error('خطا در حذف', res.message, {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                });
              }
              this.getBackTestListByProductId(this.pageIndex, this.pageSize);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            });
          debugger;
        },
        (error) => {
          debugger;
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }

  addorEdit(content, row: BackTestModel) {
    debugger;
    if (row === undefined) {
      row = new BackTestModel();
      row.productId = this.productId;
      row.product = null;
      row.videoUrl = null;
      row.fileUrl = null;
      row.id = 0;
      row.cardImagePath = null;
    }
    this.addUpdate = row;
    this.modalService

      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            this.addOrUpdate(this.addUpdate);
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset();
        }
      );
  }

  async addOrUpdate(row: BackTestModel) {
    debugger;
    if (row.id === 0) {
      await this._backtestService
        .create(row, 'BackTest')
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
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._backtestService
        .update(row.id, row, 'BackTest')
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
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }

    this.getBackTestListByProductId(this.pageIndex, this.pageIndex);
  }
}
