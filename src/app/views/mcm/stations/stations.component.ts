import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StationModel } from '../models/station.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { ToastrService } from 'ngx-toastr';
import { McmService } from '../mcm.service';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewportScroller } from '@angular/common';
import { Page } from 'src/app/shared/models/Base/page';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit {
  fileName: string = '';
  imgToDelete: string;
  stationToDeleteId: number;
  page: Page = new Page();
  imgHolder: string;
  valueChanged: boolean = false;
  stationImg: any;
  isFileCropped: boolean = false;
  imgChangeEvt: any = '';
  filePreview: any = '';
  controls = [
    { name: 'عنوان', for: 'title' },
    { name: 'کد انحصار', for: 'code' },
    { name: 'شناسه', for: 'id' },
  ];
  addForm: FormGroup;
  station: StationModel = new StationModel();
  stationsList: StationModel[] = new Array<StationModel>();
  constructor(
    private scroller: ViewportScroller,
    private loader: NgxSpinnerService,
    private uploaderService: FileUploaderService,
    private mcmService: McmService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.addForm = this.formBuilder.group({
      id: [null],

      title: [''],
      code: [''],
    });
  }

  ngOnInit(): void {
    this.getStationList();
  }
  getStationList() {
    this.mcmService.getStations(0, null).subscribe((res) => {
      this.stationsList = res.data.items;
      this.page.size = 10;
      this.page.totalElements = res.data.totalCount;
      this.page.totalPages = res.data.totalPages;
    });
  }
  openModal(content, event) {
    this.imgChangeEvt = event;
    this.fileName = event.target.files[0].name;
    this.modalService
      .open(content, {
        centered: true,
        size: 'md',
      })
      .result.then(
        (confirmed) => {
          this.imgChangeEvt = event;
          (this.stationImg = new Blob([event.target.files[0]])),
            {
              type: event.target.files[0].type,
            };
          this.isFileCropped = true;
        },
        (dismissed) => {
          (<HTMLInputElement>document.getElementById('files')).value = null;
          this.imgChangeEvt = '';
          this.isFileCropped = false;
        }
      );
  }
  cropImg(e: ImageCroppedEvent) {
    this.filePreview = e.base64;
  }
  showPicture(content) {
    this.modalService.open(content, {
      centered: true,
      fullscreen: true,
      size: 'lg',
    });
  }
  async editOrCreateModal(content, stationId: number) {
    let validForm = await this.checkForms();

    if (!validForm) {
      this.toastr.show('مقادیر را بررسی کنید', null, {
        positionClass: 'toast-top-left',
        toastClass: 'bg-danger text-small',
      });
      return;
    }
    if (validForm) {
      this.station.title = this.addForm.controls['title'].value;
      this.station.code = this.addForm.controls['code'].value;
      if (stationId == undefined) {
        this.station.id = 0;
      }
      this.modalService.open(content, {
        centered: true,
        size: 'sm',
      });
    }
  }

  async checkForms() {
    let titleLength = String(this.addForm.controls['title'].value).trim()
      .length;
    let codeLength = String(this.addForm.controls['code'].value).trim().length;

    if (codeLength == 0 || titleLength == 0 || this.imgChangeEvt == '') {
      return false;
    } else {
      return true;
    }
  }
  scroll() {
    this.valueChanged = true;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      this.valueChanged = false;
    }, 800);
  }
  fillForEdit(item: StationModel) {
    this.addForm.controls['title'].setValue(item.title);
    this.addForm.controls['code'].setValue(item.code);
    this.station.id = item.id;
    this.station.cardImagePath = item.cardImagePath;
    this.imgHolder = item.cardImagePath;
    this.imgChangeEvt = 'filled';
    this.isFileCropped = false;
  }
  resetForm() {
    this.addForm.controls['title'].setValue('');
    this.addForm.controls['code'].setValue('');
    this.imgChangeEvt = '';
    this.station = new StationModel();
    console.log(this.addForm);
  }
  async uploadFile() {
    let tableType = 35; // Stations TableType
    this.loader.show();
    this.uploaderService
      .newUpload(this.filePreview, this.station.id, tableType, this.fileName)
      .subscribe({
        next: (val) => {
          if (val.type == HttpEventType.Response) {
            const res = val.body;
            if (res.success) {
              this.station.cardImagePath = res.data;
              this.toastr.success('با موفقیت آپلود شد', null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            } else {
              this.toastr.error(res.message, 'خطا در آپلود تصویر', {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.station.cardImagePath = undefined;
            }
          }
        },
        error: (err) => {
          this.station.cardImagePath = undefined;
          this.toastr.error(null, 'خطا در آپلود تصویر', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        },
        // (res: Result<string[]>) => {
        //   if (res.success) {
        //     this.station.cardImagePath = res.data;
        //   } else {
        //     this.station.cardImagePath = undefined;
        //   }
        // }
      });
  }
  deleteModal(content, type: string, item: StationModel) {
    this.stationToDeleteId = item.id;
    this.imgToDelete = item.cardImagePath;
    this.modalService
      .open(content, {
        centered: true,
        size: 'sm',
      })
      .result.then((confirmed) => {
        if (type == 'img') {
          this.deleteFile();
        }
        if (type == 'record') {
          this.confirm('delete');
        }
      });
  }
  async deleteFile() {
    this.uploaderService.deleteFile(this.imgToDelete).subscribe((res) => {
      if (res.success) {
        this.station.cardImagePath = undefined;
        this.imgChangeEvt = '';
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
  async confirm(type: string) {
    if (type === 'add') {
      await this.uploadFile();

      setTimeout(() => {
        this.createStation();
      }, 2000);
    }
    if (type === 'edit') {
      if (this.imgHolder !== this.station.cardImagePath) {
        await this.uploadFile();
        setTimeout(() => {
          this.editStation();
        }, 2000);
      } else {
        this.editStation();
      }
    }
    if (type === 'delete') {
      await this.deleteFile();
      setTimeout(() => {
        this.deleteStation();
      }, 2000);
    }
  }

  createStation() {
    this.mcmService.create(this.station, 'Station').subscribe(
      (res) => {
        if (res.success) {
          this.addForm.controls['title'].setValue('');
          this.addForm.controls['code'].setValue('');
          this.imgChangeEvt = '';
          this.isFileCropped = false;
          this.getStationList();
          this.modalService.dismissAll('OK');
          this.toastr.success(res.message, null, {
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      },
      (err) => {
        this.toastr.error('دوباره تلاش کنید', 'خطای سرور', {
          positionClass: 'toast-top-left',
        });
      }
    );
  }
  editStation() {
    this.mcmService.update(this.station.id, this.station, 'Station').subscribe(
      (res) => {
        if (res.success) {
          this.getStationList();
          this.modalService.dismissAll('OK');
          this.toastr.success(res.message, null, {
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      },
      (err) => {
        this.toastr.error('دوباره تلاش کنید', 'خطای سرور', {
          positionClass: 'toast-top-left',
        });
      }
    );
  }
  deleteStation() {
    this.mcmService.delete(this.stationToDeleteId, 'Station').subscribe(
      (res) => {
        if (res.success) {
          if (this.station.id == this.stationToDeleteId) {
            this.station = new StationModel();
          }
          this.getStationList();

          this.modalService.dismissAll('OK');
          this.toastr.success(res.message, null, {
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      },
      (err) => {
        this.toastr.error('دوباره تلاش کنید', 'خطای سرور', {
          positionClass: 'toast-top-left',
        });
      }
    );
  }
}
