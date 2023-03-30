import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { FileModel } from './file.model';
import { FileService } from './file.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  @Input() productId: number;
  pageLoad: boolean = true;
  addUpdate: FileModel = new FileModel();
  addForm: FormGroup;
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  rows: FileModel[];
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _fileService: FileService,
    private _fileUploaderService: FileUploaderService
  ) {}

  ngOnInit(): void {
    this.getFileByProductId(this.productId, 6);
  }
  splitRow(item: FileModel) {
    var finder = this.rows.findIndex((row) => row.id === item.id);
    this.rows.splice(finder, 1);
    this.pageLoad = true;
  }
  async getFileByProductId(rowId: number, tableType: number) {
    this._fileService.getFilesByRowIdAndTableType(rowId, tableType).subscribe(
      (res: Result<FileModel[]>) => {
        debugger
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

  //Add OR Edit!!!!!!!!!!!!!!!
  addorEdit(content: any, row: FileModel) {
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

  async addOrUpdate(row: FileModel) {
    row.description = '';
    row.id = 0;
    row.isActive = true;
    row.rowID = this.productId;
    row.tableType = 6;
    row.title = '';
    row.orderID = 0;

    this._fileService
      .create(row, 'Files')

      .subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.rows.unshift(row);
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
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
    alert('image Failed to Show');
  }

  uploadFile() {
    this._fileUploaderService
      .uploadFile(this.cropImagePreview, 'products')
      .subscribe(
        (res: Result<string[]>) => {
          if (res.success) {
            this.addUpdate = new FileModel();
            this.addUpdate.filePath = res.data[0];
            this.toastr.success('با موفقیت آپلود شد', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            this.addUpdate.filePath = res.errors[0];
            this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
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
  deleteImg(item: FileModel, _content: NgbModal) {
    this.modalService
      .open(_content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._fileUploaderService
            .deleteFile(item.filePath)
            .subscribe((result) => {
              if (result.success) {
                this.toastr.success('با موفقیت حذف  شد', null, {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
                var finder = this.rows.findIndex((row) => row.id === item.id);
                this.rows.splice(finder, 1);
              } else {
                this.toastr.error(result.message, 'خطا در حذف تصویر', {
                  closeButton: true,
                  timeOut: 2000,
                  positionClass: 'toast-top-left',
                });
              }
            });
        },
        (_reason) => {
          console.log('dismiss');
        }
      );
  }
}
