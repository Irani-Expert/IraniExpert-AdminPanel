import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { FileModel } from './file.model';
import { FileService } from './file.service';
import { HttpEventType } from '@angular/common/http';

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
  isFileValid:boolean
  imageInputText:string;
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  rows: FileModel[];
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  imageUploadProccess:number=0
  imageUploadFile
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _fileService: FileService,
    private _fileUploaderService: FileUploaderService,
    private fileUploader: FileUploaderService,
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
  addorEdit(content: any) {
    this.cropImagePreview=null
   this.imageUploadProccess=0
    this.addUpdate = new FileModel;
    
    this.modalService
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', beforeDismiss: () => {
     
          if (this.imageUploadProccess == 100) {
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
            return false;
          }
       else {
          return true;
        }
      }, })
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
          this.getFileByProductId(this.productId, 6);

          
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          // this.rows.unshift(row);
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

  // uploadFile() {
  //   this._fileUploaderService
  //     .uploadFile(this.cropImagePreview, 'products')
  //     .subscribe(
  //       (res: Result<string[]>) => {
  //         if (res.success) {
  //           this.addUpdate = new FileModel();
  //           this.addUpdate.filePath = res.data[0];
  //           this.toastr.success('با موفقیت آپلود شد', null, {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         } else {
  //           this.addUpdate.filePath = res.errors[0];
  //           this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           });
  //         }
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
  deleteUploadedImg(filePath: string) {
    this.cropImagePreview=null
    this.imageUploadProccess=0
    this.imageInputText=''
    this._fileUploaderService
      .deleteFile(filePath)
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.filePath = undefined;
          this.addUpdate.fileExists = false;
          this.toastrFunction('با موفقیت حذف شد',1)
        } else {
          this.toastrFunction('خطا در حذف تصویر',2)
        }
      });
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
  checkFileValidation(event: any){
    this.cropImagePreview=null
    this.imageUploadProccess=0
    this.imgChangeEvt = event;
    this.cropImagePreview=null
    if(event.target.files[0]!=undefined){
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.cropImagePreview = reader.result; 
      }
      }
    let eventFile = event.target.files[0];
    if (eventFile.type=='image/webp') {
      this.imageUploadFile = new Blob([eventFile], {
        type: eventFile.type,
      });
      return true;

    } else {
      this.toastrFunction('فایل انتخابی باید webp باشد',3)
      return false;
    }
  }
  toastrFunction(text:string,type:number){
    switch(type) {
     case 1:
      this.toastr.success(text, null, {
        timeOut: 2000,
        closeButton: true,
        positionClass: 'toast-top-left',
      })
      break;
      case 2:
        this.toastr.error(text, null, {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-left',
        })
        break;
        case 3:
          this.toastr.show(text, null, {
            timeOut: 2000,
            closeButton: true,
            positionClass: 'toast-top-left',
          })
          break;
    }
   
  }
  uploadImg(){
    this.imageUploadProccess = 1;
    this.fileUploader
      .upload(this.imageUploadFile, 'audios')
      .pipe(
        map((event) => {
          let toasterType=2
          if (event.type == HttpEventType.UploadProgress) {
            this.imageUploadProccess = Math.round((100 * event.loaded) / event.total);
          } else if (event.type == HttpEventType.Response) {
            
            this.addUpdate.filePath = event.body.data[0];
            if (event.body.success) {
              this.isFileValid = false;
              toasterType=1
  
            } 
            
            this.toastrFunction(event.body.message,toasterType)
          }
        }),
        catchError((err) => {
          this.imageUploadProccess = 0;
          return throwError(err.message);
        })
      )
      .toPromise();
   }
}
