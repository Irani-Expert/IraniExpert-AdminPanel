import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { BackTestModel } from './back-test.model';
import { BackTestService } from './back-test.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BehaviorSubject,
  Observable,
  Subscriber,
  Subscription,
  catchError,
  map,
  throwError,
} from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Ckeditor } from 'src/app/shared/ckconfig';

@Component({
  selector: 'app-back-test',
  templateUrl: './back-test.component.html',
  styleUrls: ['./back-test.component.scss'],
})
export class BackTestComponent implements OnInit {
  public CkEditor = new Ckeditor();

  fileName: string = '';
  isFileValid: boolean = false;
  progress: number = 0;
  videoFile: Blob;
  videoName: any;
  videoPreview: any = '';
  viewMode: 'list' | 'grid' = 'list';
  rows: BackTestModel[] = new Array<BackTestModel>();
  @Input() productId: number;
  pageIndex = 1;
  pageSize = 12;
  addUpdate: BackTestModel;
  addForm: FormGroup;
  imgChangeEvt: any = '';
  cropImagePreview: any = '';

  constructor(
    public _backtestService: BackTestService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _fileUploaderService: FileUploaderService,
    private sanitizer: DomSanitizer,
    private loader: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group(
      {
        title: [null, Validators.compose([Validators.required])],
        description: [null],
        product: [null],
        videoUrl: [null],
        fileUrl: [null],
        cardImagePath: [null],
        isActive: [null],
      },
      { validator: this.checkValidFileOrUrl }
    );
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
  onFileChanged(event: any) {
    this.imgChangeEvt = event;
    this.fileName = event.target.files[0].name;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImagePreview = e.base64;
  }
  imgLoad() {}
  initCropper() {}
  imgFailed() {
    alert('image Failed to Show');
  }
  uploadFile() {
    this._fileUploaderService
      .uploadFile(this.cropImagePreview, 'backTests', this.fileName)
      .subscribe(
        (res: Result<string[]>) => {
          if (res.success) {
            this.addUpdate.cardImagePath = res.data[0];
            this.toastr.success('با موفقیت آپلود شد', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            //TODO Delete Set AddUpdate.cardImagePath
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

  // Video Downloader
  async base64Maker(file) {
    this.loader.show();
    let url = URL.createObjectURL(file);
    this.videoPreview = this.sanitizer.bypassSecurityTrustUrl(url);
    this.loader.hide();
  }
  uploadVideo() {
    this.progress = 1;
    this._fileUploaderService
      .upload(this.videoFile, 'backTests', this.videoName)
      .pipe(
        map((event) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type == HttpEventType.Response) {
            this.addUpdate.videoUrl = event.body.data[0];
            if (event.body.success) {
              this.toastr.success(event.body.message, '', {
                positionClass: 'toast-top-left',
                messageClass: 'text-small',
              });
              this.progress = 0;
              this.isFileValid = false;
            } else {
              this.progress = 0;
              this.toastr.success(event.body.message, '', {
                positionClass: 'toast-top-left',
                messageClass: 'text-small',
              });
            }
          }
        }),
        catchError((err) => {
          this.progress = 0;
          this.toastr.error('آپلود با خطا مواجه شد', '', {
            positionClass: 'toast-top-left',
            messageClass: 'text-small',
          });
          return throwError(err.message);
        })
      )
      .toPromise();
  }
  videoChangePath(event) {
    let file = event.target.files[0];
    let FileType = 'video/mp4|video/x-matroska';
    let isFileAllowed = FileType.includes(file.type);
    if (!isFileAllowed) {
      this.toastr.show('فایل انتخابی باید ویدئو باشد', '', {
        toastClass: 'text-small bg-danger text-white',
        positionClass: 'toast-top-left',

        timeOut: 2000,
      });
      return false;
    } else {
      this.videoName = file.name;
      this.videoFile = new Blob([file], {
        type: file.type,
      });
      this.base64Maker(file);
      return true;
    }
  }
  deleteBackTest(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._backtestService
            .delete(id, 'backtest')

            .subscribe((res) => {
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
              this.getBackTestListByProductId(this.pageIndex, this.pageSize);
            });
        },
        (error) => {
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }

  showvideo(content: BackTestModel, modal) {}

  addorEdit(content, row: BackTestModel) {
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

      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            this.addOrUpdate(this.addUpdate);
            this.addForm.reset();
          }
        },
        (reason) => {
          this.addForm.reset();
        }
      );
  }

  async addOrUpdate(row: BackTestModel) {
    if (row.id === 0) {
      await this._backtestService.create(row, 'BackTest').subscribe((data) => {
        if (data.success) {
          this.rows.push(row);
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
    } else {
      await this._backtestService
        .update(row.id, row, 'BackTest')
        .subscribe((data) => {
          var index = this.rows.findIndex((x) => x.id == row.id);
          if (index != -1) {
            this.rows[index] = row;
          }
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

    this.getBackTestListByProductId(this.pageIndex, this.pageIndex);
  }
}
