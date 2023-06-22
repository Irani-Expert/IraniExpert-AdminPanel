import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BannerModel } from '../../cnt/banner/banner.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, throwError } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { NgxSpinnerService } from 'ngx-spinner';
import { log } from 'console';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoPlayerComponent } from 'src/app/shared/components/video-player/video-player.component';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-upload-center',
  templateUrl: './upload-center.component.html',
  styleUrls: ['./upload-center.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
        animate('10ms ease-in-out', style({ display: 'flex' })),
      ]),
      transition(':leave', [
        animate('0ms ease-in-out', style({ display: 'none' })),
      ]),
    ]),
    trigger('slideInOut2', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
        animate('10ms ease-in-out', style({ display: 'flex' })),
      ]),
      transition(':leave', [
        animate('0ms ease-in-out', style({ display: 'none' })),
      ]),
    ]),
    trigger('slideInOut3', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
        animate('10ms ease-in-out', style({ display: 'flex' })),
      ]),
      transition(':leave', [
        animate('0ms ease-in-out', style({ display: 'none' })),
      ]),
    ]),
  ],
})
export class UploadCenterComponent implements OnInit {
  base64Data: string;
  imgChangeEvt: any = '';
  filePreview: any = '';
  isFileValid: boolean = false;
  addForm: FormGroup;
  progress: number = 0;
  file;
  fileName: string = '';
  fileChoosed: boolean = false;
  fileSize: string = '';
  steppedBack: boolean = false;
  steppedForward: boolean = false;
  fileOver: boolean = false;
  fileModel: BannerModel; // Its A file Model we post it on banners Because of the data similarity
  types = [
    {
      key: 'image/jpeg|image/webp|image/png',
      message: 'عکس و از تایپ های jpg, webp, png باشد',
      id: 0,
      title: 'عکس',
    },

    {
      key: 'video/mp4|video/x-matroska',
      message: 'ویدئو و از تایپ mp4 یا mkv باشد',
      id: 1,
      title: 'ویدئو',
    },
    {
      key: 'application/x-zip-compressed',
      message: 'فشرده شده و از تایپ  zip باشد',
      id: 2,
      title: 'فشرده',
    },
    {
      key: 'audio/mpeg',
      message: ' صوتی و از تایپ mp3 باشد',
      id: 3,
      title: 'صوتی',
    },
  ];
  selectedTypeIdentifier: number;
  sessionIdentiftier: number = 3;
  session = [
    {
      title: 'نوع فایل مورد نظر را انتخاب کنید',
      id: 1,
    },
    {
      title: 'انتخاب فایل برای آپلود',
      id: 2,
    },
    {
      title: 'پیش نمایش و ثبت',
      id: 3,
    },
  ];

  // DragOver Listener

  // @HostListener('dragover', ['$event']) onDragOver(evt) {
  //   if (this.sessionIdentiftier == 2) {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //     this.fileOver = true;
  //   }
  // }

  // // Dragleave Listener
  // @HostListener('dragleave', ['$event']) public onDragleave(evt) {
  //   if (this.sessionIdentiftier == 2) {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //     this.fileOver = false;
  //   }
  // }
  // // Drop Listener
  // @HostListener('drop', ['$event']) public onDrop(evt) {
  //   if (this.sessionIdentiftier == 2) {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //     let files = evt.dataTransfer.files;
  //     this.fileOver = false;
  //     let keysOfFileType =
  //       this.types[this.selectedTypeIdentifier].key.split('|');
  //     let isFileAllowed = keysOfFileType.includes(files[0].type);
  //     if (!isFileAllowed) {
  //       this.toastr.show(
  //         `فایل انتخابی باید ${
  //           this.types[this.selectedTypeIdentifier].message
  //         }`,
  //         '',
  //         {
  //           toastClass: 'text-small bg-danger text-white',
  //           positionClass: 'toast-top-center',

  //           timeOut: 3000,
  //         }
  //       );
  //       return;
  //     }

  //     if (files.length > 0 && isFileAllowed) {
  //       console.log(evt);

  //       this.isFileValid = this.changeFilePath(
  //         evt,
  //         this.selectedTypeIdentifier
  //       );
  //       this.toastr.show('فایل بارگذاری شد, برای آپلود اقدام کنید', '', {
  //         toastClass: 'text-small bg-light text-dark',
  //         positionClass: 'toast-top-center',
  //       });
  //     }
  //   }
  // }

  constructor(
    private _formBuilder: FormBuilder,
    private fileUploader: FileUploaderService,
    private toastr: ToastrService,
    private loader: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) {
    this.addForm = this._formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      type: [1],
      linkType: [0],
      fileType: [this.selectedTypeIdentifier],
      url: [null],
      isActive: [null],
      filePath: [null],
      fileInfo: [null],
      rowID: [null],
      orderID: [null],
    });
  }

  ngOnInit(): void {}
  nextSession(type: number) {
    if (type !== null) {
      this.fileModel = new BannerModel();
      this.fileModel.fileType = type;
      this.selectedTypeIdentifier = type;
      this.fileChoosed = false;
    }
    if (this.sessionIdentiftier !== 3) {
      this.sessionIdentiftier = this.sessionIdentiftier + 1;
      this.steppedForward = true;
      if (this.steppedBack) {
        this.steppedBack = false;
      }
    }
    // if (this.sessionIdentiftier == 3) {

    // }
  }
  perviousSession() {
    if (this.sessionIdentiftier !== 1) {
      this.sessionIdentiftier = this.sessionIdentiftier - 1;
      this.steppedBack = true;
    }
  }
  upload() {
    this.progress = 1;
    this.fileUploader
      .upload(this.file, 'audios')
      .pipe(
        map((event) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type == HttpEventType.Response) {
            this.fileModel.filePath = event.body.data[0];
            if (event.body.success) {
              this.nextSession(null);
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

  changeFilePath(event: any, type: number) {
    if (type == 0) {
      return this.imgChangePath(event);
    }
    if (type == 1) {
      return this.videoChangePath(event);
    }
    if (type == 2) {
      return this.zipFileChangePath(event);
    }
    if (type == 3) {
      return this.videoChangePath(event);
    }
  }

  // Base64Maker
  async base64Maker(file) {
    this.loader.show();
    let url = URL.createObjectURL(file);
    this.filePreview = this.sanitizer.bypassSecurityTrustUrl(url);
    this.loader.hide();
  }

  // Zip File Change Path
  zipFileChangePath(event: any) {
    let file = event.target.files[0];
    console.log(file);
    let keysOfFileType = this.types[this.selectedTypeIdentifier].key.split('|');
    let isFileAllowed = keysOfFileType.includes(file.type);
    if (!isFileAllowed) {
      this.toastr.show(
        `فایل انتخابی باید ${this.types[this.selectedTypeIdentifier].message}`,
        '',
        {
          toastClass: 'text-small bg-danger text-white',
          positionClass: 'toast-top-center',

          timeOut: 3000,
        }
      );
      return false;
    } else {
      this.fileName = file.name;
      this.file = new Blob([file], {
        type: file.type,
      });
      this.fileChoosed = true;
      return true;
    }
  }
  // Video Change Path
  videoChangePath(event: any) {
    let file = event.target.files[0];
    let keysOfFileType = this.types[this.selectedTypeIdentifier].key.split('|');
    let isFileAllowed = keysOfFileType.includes(file.type);
    if (!isFileAllowed) {
      this.toastr.show(
        `فایل انتخابی باید ${this.types[this.selectedTypeIdentifier].message}`,
        '',
        {
          toastClass: 'text-small bg-danger text-white',
          positionClass: 'toast-top-center',

          timeOut: 3000,
        }
      );
      return false;
    } else {
      this.fileName = file.name;
      this.file = new Blob([file], {
        type: file.type,
      });
      this.base64Maker(file);
      this.fileChoosed = true;
      return true;
    }
  }

  // Image Change Path
  imgChangePath(event: any) {
    this.imgChangeEvt = event;
    let file = event.target.files[0];
    let keysOfFileType = this.types[this.selectedTypeIdentifier].key.split('|');
    let isFileAllowed = keysOfFileType.includes(file.type);
    if (!isFileAllowed) {
      this.toastr.show(
        `فایل انتخابی باید ${this.types[this.selectedTypeIdentifier].message}`,
        '',
        {
          toastClass: 'text-small bg-danger text-white',
          positionClass: 'toast-top-center',

          timeOut: 3000,
        }
      );
      return false;
    } else {
      this.file = new Blob([file], {
        type: file.type,
      });
      return true;
    }
  }
  cropImg(e: ImageCroppedEvent) {
    this.filePreview = e.base64;
  }

  // Deleter File
  deleteFile() {
    this.fileUploader.deleteFile(this.fileModel.filePath).subscribe((res) => {
      if (res.success) {
        this.progress = 0;
        this.isFileValid = true;
        this.sessionIdentiftier -= 1;
        this.toastr.success(res.message, '', {
          positionClass: 'toast-top-left',
        });
      } else {
        this.toastr.error(res.message, '', {
          positionClass: 'toast-top-left',
        });
      }
    });
  }
}
