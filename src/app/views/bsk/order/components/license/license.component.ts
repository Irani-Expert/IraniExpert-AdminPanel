import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { License } from './license';
import { LicenseService } from '../../services/license.service';
import { LicenseModel } from '../../models/license.model';
import { lastValueFrom, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { HttpEventType } from '@angular/common/http';
import { Result } from 'src/app/shared/models/Base/result.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent implements OnInit {
  fileName = '';
  file: Blob;
  minDate: Date | null;
  maxDate: Date | null;
  @Input('openedModal') rowID: number;
  @Output('result') res = new EventEmitter<boolean>(false);
  @Input('licenseID') licenseID: number;
  licenseForm: FormGroup | undefined;
  license: License;
  isFileValid = false;
  licenseExist = false;
  fileExists = false;
  isFileChanged = false;
  constructor(
    private spinner: NgxSpinnerService,
    private _uploadService: FileUploaderService,
    private _licenseService: LicenseService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {}

  async createLicenseObj() {
    this.licenseForm = new FormGroup({
      startDate: new FormControl<Date | null>(null, Validators.required),
      expireDate: new FormControl<Date | null>(null, Validators.required),
      versionNumber: new FormControl<string | null>(null, Validators.required),
      filePath: new FormControl<string | null>(null),
    });
    this.license = new License(this._licenseService, this.licenseID);
    if (await this.license.get()) {
      this.license._licenseItem = this._licenseService._licenseValue;

      this.updateForm(this.license._licenseItem);
    }
    this.licenseExist = true;
  }
  destroyLicenseObj() {
    this.license = null;
    this.licenseExist = false;
    this.licenseForm.reset();
    this.file = null;
    this.isFileValid = false;
  }

  setFileReady(event) {
    let file = event.target.files[0];
    if (file.type !== 'application/x-zip-compressed') {
      this.toastr.show('فایل انتخابی باید zip باشد', '', {
        toastClass: 'text-small bg-info text-white',
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    } else {
      this.isFileChanged = true;
      this.fileName = file.name;
      this.file = new Blob([file], {
        type: file.type,
      });
      return true;
    }
  }
  async uploadFile() {
    if (this.isFileChanged && !this.fileExists) {
      this.spin(true);
      const uploadRes = this._uploadService
        .newUpload(this.file, this.rowID, 31, this.fileName)
        .pipe(
          map((event) => {
            if (event.type == HttpEventType.Response) {
              if (event.body) {
                if (event.body.success) {
                  this.fileExists = true;

                  this.license.licenseFilePath = event.body.data;
                  this.licenseForm.controls['filePath'].setValue(
                    event.body.data
                  );
                  return true;
                }
                if (!event.body.success) {
                  this.toastr.error(event.body.message, '', {
                    positionClass: 'toast-top-left',
                    closeButton: true,
                  });
                  this.spin(false);
                  return false;
                }
              } else {
                this.toastr.error('آپلود با خطا مواجه شد', 'خطا !!', {
                  positionClass: 'toast-top-left',
                  closeButton: true,
                });
                this.spin(false);
                return false;
              }
            }
          })
        );
      return await lastValueFrom(uploadRes);
    } else {
      return true;
    }
  }
  async deleteFile() {
    if (this.fileExists == true) {
      const apiRes = this._uploadService
        .deleteFile(this.license._licenseItem.filePath)
        .pipe(
          map((result) => {
            if (result.success) {
              this.fileExists = false;
              this.licenseForm.controls['filePath'].setValue('');
              this.isFileChanged = false;
              this.file = null;
            } else {
              this.toastr.error(result.message, 'خطا !', {
                positionClass: 'toast-top-left',
                closeButton: true,
              });
            }
            return result;
          })
        );
      return await lastValueFrom(apiRes);
    } else {
      let res = new Result<string>();
      res.success = true;
      return res;
    }
  }
  async deleteLicense() {
    if ((await this.deleteFile()).success) {
      let res = await this.license.delete();
      if (res) {
        if (res.success) {
          this.toastr.success(res.message, '', {
            positionClass: 'toast-top-left',
            closeButton: true,
          });
        } else {
          this.toastr.error(res.message, '', {
            positionClass: 'toast-top-left',
            closeButton: true,
          });
        }
      } else {
        this.toastr.error('خطا در برقراری ارتباط', 'خطا !!', {
          positionClass: 'toast-top-left',
          closeButton: true,
        });
      }
    }
  }
  updateForm(item: LicenseModel) {
    let startYear = parseInt(item.startDate.slice(0, 4));
    let startMonth = parseInt(item.startDate.slice(5, 7));
    let startDay = parseInt(item.startDate.slice(8, 10));
    let expYear = parseInt(item.expireDate.slice(0, 4));
    let expMonth = parseInt(item.expireDate.slice(5, 7));
    let expDay = parseInt(item.expireDate.slice(8, 10));
    this.licenseForm.patchValue({
      startDate: new Date(startYear, startMonth, startDay),
      expireDate: new Date(expYear, expMonth, expDay),
      versionNumber: item.versionNumber,
      filePath: item.filePath,
    });
    this.minDate = this.licenseForm.controls['startDate'].value;
    this.maxDate = this.licenseForm.controls['expireDate'].value;
    this.fileExists = item.fileExists;
  }
  changeStrDate(date: Date) {
    this.minDate = date;
  }
  changeExpDate(date: Date) {
    this.maxDate = date;
  }
  validateAndSend() {
    if (this.licenseForm.valid) {
      this.sendLicense();
    } else {
      this.toastr.error('لطفا فرم ارسالی را چک کنید', null, {
        positionClass: 'toast-top-left',
        closeButton: true,
      });
    }
  }
  async sendLicense() {
    let res: Result<LicenseModel> | Result<number>;

    if (await this.uploadFile()) {
      this.spin(false);
      let item = {
        id: this.licenseID,
        rowID: this.rowID,
        expireDate: this.licenseForm.controls['expireDate'].value,
        filePath: this.licenseForm.controls['filePath'].value,
        versionNumber: this.licenseForm.controls['versionNumber'].value,
        startDate: this.licenseForm.controls['startDate'].value,
      };

      if (this.licenseID == null) {
        res = await this.license.post(item);
      }
      if (this.licenseID !== null) {
        res = await this.license.put(item);
      }
      if (res) {
        if (res.success) {
          this.toastr.success(res.message, '', {
            positionClass: 'toast-top-left',
            closeButton: true,
          });
          this.res.emit(true);
        } else {
          this.toastr.error(res.message, '', {
            positionClass: 'toast-top-left',
            closeButton: true,
          });
          this.deleteFile();
        }
      } else {
        this.deleteFile();
        this.toastr.error('خطا در برقراری ارتباط', 'خطا !!', {
          positionClass: 'toast-top-left',
          closeButton: true,
        });
      }
    }
  }
  spin(action: boolean) {
    /**
     *  Show Or Close Spinner
     * @param action False: Hide ,True: Show
     * @returns Spinner
     */

    if (action)
      this.spinner.show('upload', {
        size: 'large',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        fullScreen: true,
      });
    else this.spinner.hide('upload');
  }
}
