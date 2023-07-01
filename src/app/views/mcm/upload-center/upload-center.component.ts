import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BannerModel } from '../../cnt/banner/banner.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, delay, filter, map, retry, throwError } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { NgxSpinnerService } from 'ngx-spinner';
import { error, log } from 'console';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoPlayerComponent } from 'src/app/shared/components/video-player/video-player.component';
import { EventEmitter } from 'stream';
import { McmService } from '../mcm.service';
import { StationModel } from '../models/station.model';
import { NavigationEnd, Router } from '@angular/router';
import { Utils } from 'src/app/shared/utils';
import { TableType } from '../../Log/models/table-typeModel';
import { ProductModel } from '../../prd/products-list/product.model';
import { FileModel } from '../../prd/gallery/file.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
export class UploadCenterComponent implements OnInit, OnDestroy {
  rowList: ProductModel[] = new Array<ProductModel>();
  tableTypes = [
    {
      title: 'محصولات',
      value: 6,
      inactive: false,
    },
    {
      title: 'به زودی',
      value: 999,
      inactive: true,
    },
  ];
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateIsMobileValue();
  }
  viewMode: 'grid' | 'list' = 'grid';
  selectedRow = new ProductModel();
  selectedTableType = new TableType();
  isSearched: boolean = false;
  searchedStations: StationModel[];
  stationsList: StationModel[] = new Array<StationModel>();
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
  stationForm: FormGroup;
  fileModel: FileModel; // Its A file Model we post it on banners Because of the data similarity
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
  sessionIdentiftier: number = 1;
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
    private router: Router,
    private mcmService: McmService,
    private _formBuilder: FormBuilder,
    private fileUploader: FileUploaderService,
    private toastr: ToastrService,
    private loader: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {
    this.stationForm = this._formBuilder.group({
      title: [''],
      code: [''],
    });
    this.addForm = this._formBuilder.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [true],
      type: [0],
      key: ['', Validators.required],
      filePath: [''],
      stationID: [0, Validators.required],
    });
  }
  ngOnDestroy(): void {
    if (this.fileModel?.filePath !== undefined) {
      this.deleteFile();
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        if (Utils.isLMonitor()) {
          this.viewMode = 'list';
        }
      });
    this.getStations();
    this.getTableTypeRows();
  }
  nextSession(type: number) {
    if (type !== null) {
      this.fileModel = new FileModel();
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
              this.addForm.controls['filePath'].setValue(
                this.fileModel.filePath
              );

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
  updateIsMobileValue() {
    if (Utils.isLMonitor()) {
      this.viewMode = 'list';
    } else {
      this.viewMode = 'grid';
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
      }
      return;
    });
  }

  getStations() {
    this.mcmService.getStations(0, null).subscribe((res) => {
      this.stationsList = res.data.items;
    }).unsubscribe;
  }

  searchStation(formControl: string, value: string) {
    this.searchedStations = [];
    this.isSearched = true;
    let searchString = value;
    if (searchString.trim().length == 0) {
      this.toastr.show('موردی یافت نشد', null, {
        positionClass: 'toast-top-left',
        toastClass: 'bg-danger',
        timeOut: 2000,
      });
      return;
    }
    this.stationsList.forEach((item) => {
      if (item[formControl] == searchString) {
        this.searchedStations.push(item);
        return;
      } else {
        this.searchedStations = [];
        this.toastr.show('موردی یافت نشد', null, {
          positionClass: 'toast-top-left',
          toastClass: 'bg-danger',
          timeOut: 2000,
        });
      }
    });
  }
  resetSearchForm(formControl: string) {
    this.isSearched = false;
    this.stationForm.controls[formControl].setValue('');
  }

  getTableTypeRows() {
    this.mcmService.get(0, null, 'ID', null, 'Product').subscribe((res) => {
      if (res.success && res.data.totalCount > 0) {
        this.rowList = res.data.items;
        this.selectedRow = this.rowList[0];
      }
      if (res.success && res.data.totalCount == 0) {
        this.rowList = [
          {
            id: 0,
            isActive: false,
            type: 0,
            orderID: 0,
            title: 'موردی یافت نشد',
            cardImagePath: null,
            description: '',
            fileExists: false,
            iconPath: null,
          },
        ];
      }
    }).unsubscribe;
  }

  // getTableTypes() {
  //   this.mcmService.getTableTypes().subscribe((res) => {
  //     res.data
  //       .filter((it) => it.value == 6)
  //       .forEach((item) => {
  //         this.tableTypes.unshift(item);
  //       });
  //   }).unsubscribe;
  // }

  // setTableType() {
  //   this.addForm.controls['tableType'].setValue(this.selectedTableType.value);

  //   this.addForm.controls['rowID'].setValue(this.rowList[0].id);
  // }

  selectStation(item: StationModel) {
    this.addForm.controls['stationID'].setValue(item.id);
  }
  addFile(content) {
    let fileToSend: FileModel = new FileModel();
    fileToSend.title = this.addForm.controls['title'].value;
    fileToSend.description = this.addForm.controls['description'].value;
    fileToSend.isActive = this.addForm.controls['isActive'].value;
    fileToSend.rowID = this.selectedRow.id;
    fileToSend.tableType = this.selectedTableType.value;
    fileToSend.filePath = this.addForm.controls['filePath'].value;
    fileToSend.type = this.addForm.controls['type'].value;
    fileToSend.key = this.addForm.controls['key'].value;
    fileToSend.stationID = this.addForm.controls['stationID'].value;
    fileToSend.fileType = this.selectedTypeIdentifier;
    this.modalService
      .open(content, {
        centered: true,
        size: 'sm',
      })
      .result.then((accepted) => {
        this.createFile(fileToSend);
      });
  }
  createFile(file: FileModel) {
    this.mcmService.create(file, 'Files').subscribe((res) => {
      if (res.success) {
        this.toastr.success(res.message, '', {
          positionClass: 'toast-top-left',
          timeOut: 1500,
        });
        this.sessionIdentiftier = 1;
        this.selectedTypeIdentifier = null;
        this.steppedForward = false;
        this.steppedBack = false;
        this.fileModel = new FileModel();
        this.imgChangeEvt = '';
        this.addForm.reset();
      } else {
        this.toastr.error(res.message, '', {
          positionClass: 'toast-top-left',
          timeOut: 1500,
        });
      }
    });
  }
}
