import { Component, OnInit } from '@angular/core';
import { UrvService } from '../urv.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { TableType } from '../../Log/models/table-typeModel';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Result } from 'src/app/shared/models/Base/result.model';

@Component({
  selector: 'app-single-url',
  templateUrl: './single-url.component.html',
  styleUrls: ['./single-url.component.scss'],
  providers: [DialogService],
})
export class SingleUrlComponent implements OnInit {
  selectedTableType: TableType;
  formGroup: FormGroup;
  tableTypeExist = false;
  wannaPutSmth = false;
  tableTypes: any = [];
  dataExist = false;
  constructor(
    private urvService: UrvService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialogService: DialogService
  ) {
    this.formGroup = this._formBuilder.group({
      tableType: [null],
      fromUrl: [null],
      destUrl: [null],
    });
    this.formGroup.disable();
  }

  async ngOnInit() {
    let id = this._route.snapshot.paramMap.get('id');
    if (this.urvService.singelUrlSubject.value == null) {
      if (parseInt(id) == -1) {
        this._router.navigateByUrl('/urv');
      }
      if (await this.getOne(parseInt(id))) {
        this.getTabTypes();
        this.formGroup.controls['fromUrl'].setValue(this._item.fromUrl);
        this.formGroup.controls['destUrl'].setValue(this._item.destUrl);
        this.formGroup.controls['tableType'].setValue(this._item.tableType);

        this.dataExist = true;
      } else {
        this._toastr.error('لطفا دوبار امتحان کنید', 'خطا !!', {
          positionClass: 'toast-top-left',
          timeOut: 3000,
          progressBar: true,
        });
      }
    } else {
      this.getTabTypes();
      this.formGroup.controls['fromUrl'].setValue(this._item.fromUrl);
      this.formGroup.controls['destUrl'].setValue(this._item.destUrl);
      this.formGroup.controls['tableType'].setValue(this._item.tableType);

      if (parseInt(id) == -1) {
        this.formGroup.enable();
      }
      this.dataExist = true;
    }
  }
  get _item() {
    return this.urvService.singelUrlSubject.value;
  }
  private get _tableType() {
    return this.formGroup.controls['tableType'].value;
  }
  private get _fromUrl() {
    return this.formGroup.controls['fromUrl'].value;
  }
  private get _destUrtl() {
    return this.formGroup.controls['destUrl'].value;
  }

  // Post and Put
  // post(item) {

  // let subscribe = this.urvService.create(item, 'URLRedirect').subscribe({
  //   next: (res) => {
  //     if (res.success) {
  //       this._toastr.success(res.message, 'موفق', {
  //         positionClass: 'toast-top-left',
  //         timeOut: 3000,
  //         progressBar: true,
  //       });
  //     } else {
  //       this._toastr.error(res.message, 'خطا !', {
  //         positionClass: 'toast-top-left',
  //         timeOut: 3000,
  //         progressBar: true,
  //       });
  //     }
  //   },
  //   error: (err) => {
  //     this._toastr.error('مشکل اعتبار سنجی یا برقراری با سرور', 'خطا !', {
  //       positionClass: 'toast-top-left',
  //       timeOut: 3000,
  //       progressBar: true,
  //       messageClass: 'text-small',
  //     });
  //   },
  //   complete: () => {
  //     subscribe.unsubscribe();
  //   },
  // });
  // }

  put() {
    let item = {
      ...this._item,
      ...{
        id: this._item.id,
        tableType: this._tableType,
        fromUrl: this._fromUrl,
        destUrl: this._destUrtl,
      },
    };
    let subscribe = this.urvService
      .update(item.id, item, 'URLRedirect')
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.wannaPutSmth = false;
            this._toastr.success(res.message, 'موفق', {
              positionClass: 'toast-top-left',
              timeOut: 3000,
              progressBar: true,
            });
          } else {
            this.wannaPutSmth = false;
            this._toastr.error(res.message, 'خطا !', {
              positionClass: 'toast-top-left',
              timeOut: 3000,
              progressBar: true,
            });
          }
          this._router.navigateByUrl('/urv');
        },
        error: (err) => {
          this._toastr.error('مشکل اعتبار سنجی یا برقراری با سرور', 'خطا !', {
            positionClass: 'toast-top-left',
            timeOut: 3000,
            progressBar: true,
            messageClass: 'text-small',
          });
        },
        complete: () => {
          subscribe.unsubscribe();
        },
      });
  }

  //  Get Table types
  async getTabTypes() {
    const res = await this.urvService.getTableTypes();
    if (res) {
      this.tableTypes = this.urvService.tableTypes$.value.filter(
        (it) => it.value == 1 || it.value == 6 || it.value == 36
      );

      this.selectedTableType = this.tableTypes[0];
      this.tableTypeExist = true;
    } else {
      this._toastr.show(
        'در گرفتن بخش ها مشکلی پیش آمده لطفا صفحه را بروز رسانی کنید'
      );
    }
  }
  async getOne(id: number) {
    const res = this.urvService.getOneByID(id, 'URLRedirect').pipe(
      map((it) => {
        if (it.success) {
          this.urvService.singelUrlSubject.next(it.data);
        }
        return it.success;
      })
    );
    return await lastValueFrom(res);
  }
  changeTableType(value: number) {
    let index = this.tableTypes.findIndex((it) => it.value == value);
    this.selectedTableType = this.tableTypes[index];
  }
  async addOrUpdate() {
    if (this._item.id == -1) {
      this.post();
    } else {
      this.wannaPutSmth = true;
    }
  }

  ref: DynamicDialogRef | undefined;
  post() {
    let item = {
      id: 0,
      tableType: this._tableType,
      fromUrl: this._fromUrl,
      destUrl: this._destUrtl,
    };
    this.ref = this.dialogService.open(AdditionComponent, {
      data: {
        sendingItem: item,
        routeOfAction: 'URLRedirect',
      },
      header: 'ایجاد',
      draggable: false,
    });
    this.ref.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  modalConfirmed(res: Result<any>) {
    if (res) {
      res.success
        ? this._toastr.success(res.message, '', {
            closeButton: true,
            positionClass: 'toast-top-left',
          })
        : this._toastr.error(
            res.message || 'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
            '',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
    } else {
      console.log('Denied Or Server Err');
    }
    this._router.navigateByUrl('/urv');
  }
}
