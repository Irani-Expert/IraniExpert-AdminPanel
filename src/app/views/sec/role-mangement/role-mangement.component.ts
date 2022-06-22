import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { RoleModel } from './role.model';
import { RoleService } from './role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-mangement',
  templateUrl: './role-mangement.component.html',
  styleUrls: ['./role-mangement.component.scss'],
})
export class RoleMangementComponent implements OnInit {
  rows: RoleModel[] = new Array<RoleModel>();
  allSelected: boolean;
  pageIndex = 1;
  pageSize = 12;
  addUpdate: RoleModel;
  addForm: FormGroup;
  constructor(
    public _roleService: RoleService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
    });
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;
    this.getRoleList(this.pageIndex, this.pageSize);
  }
  async getRoleList(pageNumber: number, seedNumber: number) {
    this._roleService
      .get(pageNumber, seedNumber, 'ID', null, 'aspnetrole')
      .subscribe(
        (res: Result<RoleModel[]>) => {
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
  async roleEdit(content: any, row: RoleModel) {
    if (row === undefined) {
      row = new RoleModel();
      row.id = 0;
      row.name = null;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, {
        size: 'sm',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            this.addOrUpdate(this.addUpdate);
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset;
        }
      );
  }
  async addOrUpdate(row: RoleModel) {
    if (row.id === 0) {
      await this._roleService
        .create(row, 'aspnetrole')
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
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._roleService
        .update(row.id, row, 'aspnetrole')
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
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }
    this.getRoleList(this.pageIndex, this.pageIndex);
  }
  deleteRole(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._roleService
          .delete(id, 'aspnetrole')
          .toPromise()
          .then((res) => {
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
          });
      });
    this.getRoleList(this.pageIndex, this.pageSize);
  }
}
